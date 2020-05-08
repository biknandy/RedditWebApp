// namespaced functions for application
var homeApp = {

  //utility functions
  utils: {

    //check if the string has the following characters (image)
    isImageUrl: (url) => {
      return(url.match(/\.(jpeg|jpg|gif|png|gifv)$/) != null);
    }, //END: isImageUrl

    //function that takes id and extracts relevant object
    getObjectFromArray: (id, dataArr) => {
      var result = dataArr.find (obj => {return obj.id == id});
      return result;
    }, //END: getObjectFromArray

    getKeyByValue: (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    }, //END: getKeyByValue
  },

  //general scripts for application
  scripts: {

    //generate Body pased on image or text
    generateBody: (url, bodyText, flag) => {
      //check if image exists
      if (homeApp.utils.isImageUrl(url)){
        //check if "gifv" extension - if so HTML can't load it so turn it into image/gif
        if (url.substr(-4)=="gifv"){
          return `<img id = "img" class = "img-fluid" src=${url.slice(0, -1)} alt="Card Image">`
        // otherwise it's a regular photo
        } else if (flag) {
          return `<img id = "img" class = "img-fluid" src=${url} alt="Card image">`
        } else {
          return `<img style="max-height:500px;" id = "img" class = "img-fluid" src=${url} alt="Card image">`
        }
      //if not an image, there may be body text in which case show it (but don't show if the text is extremely long)
      } else if (bodyText != "" && bodyText.length < 1000) {
        return `<p> ${bodyText} </p>`
      //if a regular url
      } else if (!url.includes("reddit.com") && !url.includes("redd.it")) {
        return `<p> <a href="${url}" target="_blank"> ${url} </a> </p>`
      }
      //otherwise no body
      else {
        return '<p></p>'
      }
    }, //END: generateBody

    //render the Modal for a button click
    renderModal: (event) => {

      //make jquery work
      jQuery.noConflict();

      //retreive elements from event body and set to modal
      body = homeApp.scripts.generateBody(event.data.url, event.data.selftext, true)
      $('#modalSub').text(event.data.subreddit_name_prefixed);
      $('#modalSub').attr('href', "https://reddit.com/"+ event.data.permalink);
      $('#modalTitle').text(event.data.title)
      $('#modalBody').html(body);
      $('#modalUps').html('<i class="fas fa-arrow-up"></i> &nbsp;' + event.data.ups);
      $('#modalAuthor').text(event.data.author);
      $(`#modalUpButton`).click({id: event.data.id}, homeApp.scripts.upvote);

      $('#postModal').modal('show');


    }, //END renderModal

    // reddit data formatting and rending in list view
    renderRedditList: (redditData) => {

      //create directory of searchable objects
      var searchElements = {}

      //loop through all elements of data array
      for (i in redditData){

        //set readable variables
        var postID = redditData[i].id;
        var url = redditData[i].url;
        var bodyText = redditData[i].selftext;
        var subredditName = redditData[i].subreddit_name_prefixed;
        var title = redditData[i].title;
        var link = redditData[i].permalink;
        var postAuthor = redditData[i].author;
        var updoots = redditData[i].ups;

        //populate search elements
        searchElements[postID] = title.toLowerCase() + subredditName.toLowerCase()

        //conditional rendering of html
        let body = homeApp.scripts.generateBody(url, bodyText, false);


        //card HTML to be rendered to page
        var card = $(`<div id ="${postID}-card" class="card border-primary"><div class = "card-header"><button type="button" id =${postID} class="btn btn-outline-primary btn-large btn-block">\
          <div class = "font-weight-bold" id = "subreddit"> ${subredditName} </div></button></div>\
          <div class="card-body">\
            <h5 id = "postTitle" class="card-title">${title}</h5>` + body +
            `<div class="container-fluid"><div class = "row">\
                <p class="card-text col-6 mt-2"><a id = "redLink" href="https://reddit.com/${link}" target="_blank">Link</a></p>\
                <p class="card-text col-6 text-right mt-2"><small id = "author" class="text-muted"> ${postAuthor}</small></p>\
              </div></div></div></div>`);

        //append HTML to the card deck
        card.appendTo('#cardDeck');

        // click handler for each of the list view header button
        $(`#${redditData[i].id}`).click(redditData[i], homeApp.scripts.renderModal);

      }

      console.log(searchElements)
      //activate searchBar
      homeApp.scripts.searchContent(searchElements);
    }, //END: renderRedditList

    //Empty card list to get new reddit information
    emptyList: () => {
      $('#cardDeck').empty();
    }, //END: emptyList

    searchContent: (searchables) => {

      // on keyup of searchBox
      $("#searchBox").on('keyup', (e) =>{
        //light copy of items for each keyup
        var searchItems = Object.assign({}, searchables);

        //filter out erroneous keys such as return, control, space, etc.
        if (e.which !== 32 && e.which !== 16 && e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40) {
          //grab user input
          var userInput = $('#searchBox').val().toLowerCase();

          //get all Values and Keys
          var allValues = Object.values(searchItems);
          var allKeys = Object.keys(searchItems);

          //check if each value is valid, otherwise remove from object to get updated list
          for (i in allValues){
            if (!allValues[i].includes(userInput)){
              delete searchItems[homeApp.utils.getKeyByValue(searchItems, allValues[i])];
            }
          }

          //loop through updated object and hide or show elements
          for (x in allKeys){
            //if the item is not in the list, remove it
            if (!Object.keys(searchItems).includes(allKeys[x])){
              $(`#${allKeys[x]}-card`).hide(400);
            //otherwise show it
            } else {
              $(`#${allKeys[x]}-card`).show(400);
            }
          }
        }
      })

      $("#searchForm").submit((e) =>{
        e.preventDefault();
        console.log(searchables)
      })

    },


  }


}

// function runportalSearch(){
//
// 	//keyup detects when a keyboard key is released
// 	$('#praevium-search-box').on('keyup', function(e) {
// 		//32 is a code that verifies the key is a character
// 		//16 is a code that filters out the shift key which was a problem for underscores
// 		//filters out keys like control, return, space, etc
// 	    if (e.which !== 32 && e.which !== 16 && e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40) {
//
// 	    	var value = $('#praevium-search-box').val();
// 	        var noWhitespaceValue = value.replace(/\s+/g, '');
// 	        var noWhitespaceCount = noWhitespaceValue.length;
//
// 	        //clear search results if count is less than 2
// 	        if(noWhitespaceCount < 2){
//
// 	        	$("#search-results-container").slideUp(250);
// 	        	$("#praevium-search-content").hide();
//
// 	        }
//
// 	        //perform query for runs if 2 or more characters are entered
// 	        if (noWhitespaceCount >= 2){
//
// 	        	$("#praevium-search-content").show();
// 	        	$("#search-results-container").slideDown(400);
//
// 	        	$.post(baseUrl + "snapshot/snapshot_search", {query: noWhitespaceValue})
// 	        	//on success
//     			.then(function(data){
//
//     				//convert JSON string to array of JS objects
//             		var runDataObjArray = JSON.parse(data);
//
//             		//initalize variable and pre-fill with header content
//             		var searchResultsHtml = "<h3 class=\"font-weight-light\">Search Results: \"" + noWhitespaceValue + "\"</h3><small>Press 'Enter' to navigate to the portal of the first result</small>";
//             		//iterate through search results and create html strings
//             		$.each(runDataObjArray, function(key, runData){
//
//             			searchResultsHtml = searchResultsHtml +
//
//             				"<ul class=\"list-group mb-2\">" +
// 								"<li class=\"list-group-item d-flex justify-content-between align-items-center\">" +
// 								    "<div>" +
// 								    	"<h5 class=\"d-inline alert alert-success border-success px-1 py-0\"><strong>" + runData.run_formatted + "</strong></h5>" +
// 								    	"<h6 class=\"d-inline font-weight-light px-1 mt-1\">" + runData.type_id + "</h6>" +
// 								    "</div>" +
//
// 								    "<span> <a href=\"/overview/" + runData.type_id + "/" + runData.run_formatted + "\" class=\"standard-link search-result-portal-link\">Portal</a></span>" +
// 								"</li>" +
//
// 								"<li class=\"list-group-item\">" +
// 							 		"<div>" + runData.purpose_of_run + "</div>" +
// 							 	"</li>" +
// 							"</ul>";
//             		});
//
// 					//write search results html to DOM
//             		$("#praevium-search-content").html(searchResultsHtml);
//
//     			}); //END: $.post(baseUrl + "snapshot/snapshot_search", {query: noWhitespaceValue})
//
// 	        } //END: if (noWhitespaceCount >= 2){
//
// 	    } //END: if (e.which !== 32 && e.which !== 16 && e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40) {
//
// 	}); //END: $('#praevium-search-box').on('keyup', function(e) {
//
// 	//show or hide search results if the user click in or out of the search box
// 	$('#praevium-search-box').focus(function() {
//     	var value = $("#praevium-search-box").val();
// 	    var noWhitespaceValue = value.replace(/\s+/g, '');
// 	    var noWhitespaceCount = noWhitespaceValue.length;
// 	    if(noWhitespaceCount >= 2){
// 	        $("#praevium-search-content").show();
// 	        $("#search-results-container").slideDown(500);
// 	    }
//
// 	}).blur(function() {
// 		var value = $("#praevium-search-box").val();
// 	    var noWhitespaceValue = value.replace(/\s+/g, '');
// 	    var noWhitespaceCount = noWhitespaceValue.length;
// 	    if(noWhitespaceCount >= 2){
// 	    	//check to see if mouse is over search content results
// 	    	var isHovered = $("#praevium-search-content").is(":hover");
// 	    	//if not, hide the search results
// 	    	if(isHovered === false){
// 	    		$("#search-results-container").slideUp(250);
// 	    		$("#praevium-search-content").hide();
// 	    		$('#praevium-search-box').val("");
// 	    	} else{
//
// 	    		//bind click event to DOM to close up search results if user clicks outside of search content or search
// 	    		$(document).mouseup(function (e){
//
// 					var container = $("#praevium-search-content, #praevium-search-box");
//
// 					if (!container.is(e.target) && container.has(e.target).length === 0){
//
// 						$("#search-results-container").slideUp(250);
// 	    				$("#praevium-search-content").hide();
// 	    				$('#praevium-search-box').val("");
//
// 					}
//
// 				});
//
// 	    	}
//
// 	    }
//
// 	}) //END: $('#praevium-search-box').focus(function() {
//
// 	//govern behavior of enter key when it's pressed in the context of the searchbox
// 	//binds keypress function to searchbox
// 	$('#praevium-search-box').keypress(function(e){
//
// 		//if enter was pressed, evaluate search results and navigate to top result
// 		if ( e.which == 13 ) {
// 			//prevent default beahvior
// 			e.preventDefault();
// 			//grabs the first result portal link
// 			var portalLink = $('.search-result-portal-link').attr('href');
// 			//navigate to the portal for that result
// 			window.location.href = portalLink;
//
// 		}
//
// 	});
//
// }

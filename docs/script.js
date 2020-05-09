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
  }, //END: Utils

  //general scripts for application
  scripts: {

    //add or remove favorites to local storage
    addRemoveFavorites: (event) => {
      //if the element is not in the array, add it
      if (event.data.favArray.includes(event.data.id) === false){
        event.data.favArray.push(event.data.id);
        console.log(event.data.allData)
        //add to html
        $("#favButtons").append(`<button type="button" id="${event.data.id}-fav-btn" class="btn btn-primary btn-md btn-block my-3">${event.data.sub}</button>`);

        // click handler for each of the list view header button
        $(`#${event.data.id}-fav-btn`).click(event.data.allData, homeApp.scripts.renderModal);

      //otherwise remove it
      } else {
        //remove using index of the element
        const index = event.data.favArray.indexOf(event.data.id);
        if (index > -1) {
          event.data.favArray.splice(index, 1);
        }

        //remove html
        $(`#${event.data.id}-fav-btn`).remove();
      }
      //add to localstorage
      localStorage.setItem('fav', JSON.stringify(event.data.favArray))
      console.log(event.data.favArray)
    }, //END: addRemoveFavorites

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

      //retreive elements from event body and set to modal/ show modal
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

      //list of favorite items
      var favorites = [];

      //retreive local stroage if it exists
      if (window.localStorage.length == 0){
        favorites = []
      } else {
        favorites = JSON.parse(localStorage.getItem('fav'))
      }
      // console.log(favorites)

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
                <div id="${postID}-fav" class="card-text col-6 mt-2"><i id="${postID}-heart" class="heart far fa-heart"></i> </div>\
                <p class="card-text col-6 text-right mt-2"><small id = "author" class="text-muted"> ${postAuthor}</small></p>\
              </div></div></div></div>`);

        //append HTML to the card deck
        card.appendTo('#cardDeck');

        // click handler for each of the list view header button
        $(`#${postID}`).click(redditData[i], homeApp.scripts.renderModal);

        //click handler for heart element
        $(`#${postID}-fav`).click({id: postID, favArray: favorites, sub: subredditName, allData: redditData[i]}, homeApp.scripts.addRemoveFavorites);

      }
      console.log(favorites)
      //Toggle click of heart for changing color
      $(".heart").click(function() {
        $(this).toggleClass("far fas");
      });

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

      //don't actually search for anything by the search button
      $("#searchForm").submit((e) =>{
        e.preventDefault();
      })

    }, //END: searchContent


  } //END: scripts


}

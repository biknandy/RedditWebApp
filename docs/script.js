// namespaced functions for application
var redditApp = {

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
    } //END: getObjectFromArray
  },

  //general scripts for application
  scripts: {

    //generate Body pased on image or text
    generateBody: (url, bodyText) => {
      //check if image exists
      if (redditApp.utils.isImageUrl(url)){
        //check if "gifv" extension - if so HTML can't load it so turn it into image/gif
        if (url.substr(-4)=="gifv"){
          return `<img id = "img" class = "img-fluid" src=${url.slice(0, -1)} alt="Card Image">`
        // otherwise it's a regular photo
        } else {
          return `<img id = "img" class = "img-fluid" src=${url} alt="Card image">`
        }
      //if not an image, there may be body text in which case show it (but don't show if the text is extremely long)
      } else if (bodyText != "" && bodyText.length < 500) {
        return `<p class = "card-text"> ${bodyText} </p>`
      //otherwise no body
      } else {
        return '<p></p>'
      }
    }, //END: generateBody

    //render the Modal for a button click
    renderModal: (event) => {

      //make jquery work
      jQuery.noConflict();

      //retreive elements from event body and set to modal
      body = redditApp.scripts.generateBody(event.data.url, event.data.selftext)
      $('#modalSub').text(event.data.subreddit_name_prefixed);
      $('#modalSub').attr('href', "https://reddit.com/"+ event.data.permalink);
      $('#modalTitle').text(event.data.title)
      $('#modalBody').html(body);
      $('#modalUps').text(event.data.ups);
      $('#modalAuthor').text(event.data.author);

      // event.preventDefault();

      $('#postModal').modal('show');


    }, //END renderModal

    // reddit data formatting and rending in list view
    renderRedditList: (redditData) => {
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

        //conditional rendering of html
        let body = redditApp.scripts.generateBody(url, bodyText);


        //card HTML to be rendered to page
        var card = $(`<div class="card border-primary"><div class = "card-header"><button type="button" id =${postID} class="btn btn-primary btn-lg btn-block">\
          <h6 id = "subreddit"> ${subredditName} </h6></button></div>\
          <div class="card-body">\
            <h5 id = "postTitle" class="card-title">${title}</h5>` + body +
            `<div class="container-fluid"><div class = "row">\
                <p class="card-text col-6 mt-2"><a id = "redLink" href="https://reddit.com/${link}" target="_blank">Link</a></p>\
                <p class="card-text col-6 text-right mt-2"><small id = "author" class="text-muted"> ${postAuthor}</small></p>\
              </div></div></div></div>`);

        //append HTML to the card deck
        card.appendTo('#cardDeck');



        // click handler for each of the list view header button
        $(`#${redditData[i].id}`).click(redditData[i], redditApp.scripts.renderModal);

      }
    }, //END: renderRedditList

    //Empty card list to get new reddit information
    emptyList: () => {
      $('#cardDeck').empty();
    }, //END: emptyList


  }


}

// namespaced functions for application
var redditApp = {
  utils: {

    //check if the string has the following characters (image)
    isImageUrl: (url) => {
      return(url.match(/\.(jpeg|jpg|gif|png|gifv)$/) != null);
    },

  },

  scripts: {

    // reddit data formatting and rending in list view
    renderRedditList: (redditData) => {
      //loop through all elements of data array
      for (i in redditData){

        //conditional rendering of html
        let body;

        //check if image exists
        if (redditApp.utils.isImageUrl(redditData[i].url)){
          //check if "gifv" extension - if so HTML can't load it so turn it into image/gif
          if (redditData[i].url.substr(-4)=="gifv"){
            body = `<img id = "img" class = "img-fluid" src=${redditData[i].url.slice(0, -1)} alt="Card Image">`
          // otherwise it's a regular photo
          } else {
            body = `<img id = "img" class = "img-fluid" src=${redditData[i].url} alt="Card image">`
          }
        //if not an image, there may be body text in which case show it (but don't show if the text is extremely long)
      } else if (redditData[i].selftext != "" && redditData[i].selftext < 500) {
          body = `<p class = "card-text"> ${redditData[i].selftext} </p>`
        //otherwise no body
        } else {
          body = '<p></p>'
        }


        //card HTML to be rendered to page
        var card = $(`<div class="card border-primary"><div class = "card-header"><button type="button" id =${redditData[i].id} class="btn btn-primary btn-lg btn-block">\
          <h6 id = "subreddit"> ${redditData[i].subreddit_name_prefixed} </h6></button></div>\
          <div class="card-body">\
            <h5 id = "postTitle" class="card-title">${redditData[i].title}</h5>` + body +
            `<div class="container-fluid"><div class = "row">\
                <p class="card-text col-6 mt-2"><a id = "redLink" href="https://reddit.com/${redditData[i].permalink}" target="_blank">Reddit Link</a></p>\
                <p class="card-text col-6 text-right mt-2"><small id = "author" class="text-muted"> ${redditData[i].author}</small></p>\
              </div></div></div></div>`);

        //append HTML to the card deck
        card.appendTo('#cardDeck');
      }
    },

    //Empty card list to get new reddit information
    emptyList: () => {
      $('#cardDeck').empty();
    }

  }


}

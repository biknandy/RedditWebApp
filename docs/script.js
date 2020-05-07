// namespaced functions for application
var redditApp = {
  utils: {
    isImageUrl: (url) => {
      return(url.match(/\.(jpeg|jpg|gif|png|gifv)$/) != null);
    }

  },

  scripts: {

    // reddit data formatting and rending in list view
    renderRedditList: (redditData) => {
      //loop through all elements of data array
      for (i in redditData){
        // checks for data go here

        //check if photo or not
          //check if gif or not
        let body;
        if (redditApp.utils.isImageUrl(redditData[i].url)){
          if (redditData[i].url.substr(-4)=="gifv"){
            body = `<img id = "img" class = "img-fluid" src=${redditData[i].url.slice(0, -1)} alt="Card Image">`
          } else {
            body = `<img id = "img" class = "img-fluid" src=${redditData[i].url} alt="Card image">`
          }
        } else if (redditData[i].self_text !== undefined) {
          body = `<p class = "card-text"> ${redditData[i].self_text} </p>`
        } else {
          body = '<p></p>'
        }


        //card HTML to be rendered to page
        var card = $(`<div class="card"><div class = "card-header"><button type="button" id =${redditData[i].id} class="btn btn-primary btn-lg btn-block">\
          <h6 id = "subreddit"> ${redditData[i].subreddit_name_prefixed} </h6></button></div>\
          <div class="card-body">\
            <h5 id = "postTitle" class="card-title">${redditData[i].title}</h5>` + body +
            `<div class="container-fluid"><div class = "row">\
                <p class="card-text col-6 mt-2"><a id = "redLink" href="https://reddit.com/${redditData[i].permalink} target="_blank">Reddit Link</a></p>\
                <p class="card-text col-6 text-right mt-2"><small id = "author" class="text-muted"> ${redditData[i].author}</small></p>\
              </div></div></div></div>`);
        card.appendTo('#cardDeck');
      }
    }
  }

}

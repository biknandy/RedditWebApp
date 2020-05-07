// namespaced functions to use
var redditApp = {
  utils: {

  },

  scripts: {
    renderRedditList: (redditData) => {
      for (i in redditData){
        var card = $(`<div class="card"><div class = "card-header"><button type="button" id =${redditData[i].id} class="btn btn-primary btn-lg btn-block">\
          <h6 id = "subreddit"> ${redditData[i].subreddit_name_prefixed} </h6></button></div>\
          <div class="card-body">\
            <h5 id = "postTitle" class="card-title">${redditData[i].title}</h5>\
            <p class="card-text"></p>\
            <img id = "img" class = "img-fluid" src=${redditData[i].url} alt="Card image cap">\
            <div class="container-fluid">\
              <div class = "row">\
                <p class="card-text col-6 mt-2"><a id = "redLink" href="https://reddit.com/" + ${redditData[i].permalink} target="_blank">Reddit Link</a></p>\
                <p class="card-text col-6 text-right mt-2"><small id = "author" class="text-muted"> ${redditData[i].author}</small></p>\
              </div>\
            </div>\
          </div>\
        </div>`)
        card.appendTo('#cardDeck');
      }
    }
  }

}

const createServer = require('http').createServer;
const url = require('url');
const axios = require('axios');
const config = require('./config');
const snoowrap = require('snoowrap');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = 8080;

//new snoowrapper
const r = new snoowrap({
  userAgent: config.userAgent,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  refreshToken: config.refreshToken,
});

// Set route for reddit Data
app.get('/api/reddit/', (req, res) => {

  //get the top 10 posts of r/popular from reddit
  r.getSubreddit('popular').getHot({limit: 15}).then(redditData =>{
    //show in terminal
    // console.log(redditData)

    //send data in a stringified obejct
    res.send(
      JSON.stringify({
        data: redditData
      })
    );
  }).catch((err) => {
    console.log(err)
  });
})


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

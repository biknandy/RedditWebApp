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

const r = new snoowrap({
  userAgent: config.userAgent,
  clientId: config.clientId,
  clientSecret: config.clientSecret,
  refreshToken: config.refreshToken,
});

app.get('/api/reddit/', (req, res) => {
  r.getSubreddit('popular').getHot({limit: 5}).then(redditData =>{
    console.log(redditData)

    res.send(
      JSON.stringify({
        data: redditData
      })
    );
  });
})

// app.post('/api/reddit/', (req,res) =>{
//   r.getSubreddit('popular').getHot({limit: 1}).then(redditData =>{
//     console.log(redditData)
//
//     res.send(
//       JSON.stringify({
//         data: redditData
//       })
//     );
//   });
// });



app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

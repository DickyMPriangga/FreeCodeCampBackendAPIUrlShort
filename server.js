require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

var shorturlMap = new Map();
var shorturlIndex = 0;

var shorturlpostHandler = function(req,res) {
  var url = req.body.url.replace(/^https?\:\/\//i, "").split("/")[0];
  dns.lookup(url, function(err,addresses, family){
    if(err && url !== "localhost:3000") {
      console.log(err);
      res.json({error:'invalid url'});
    } else {
      shorturlIndex++;
      shorturlMap.set(shorturlIndex.toString(), req.body.url);
      res.json({original_url:req.body.url, short_url: shorturlIndex});
    }
  });
}

var redirectHandler = function(req,res) {
  console.log(shorturlMap);
  if(shorturlMap.has(req.params.id)) {
    res.redirect(shorturlMap.get(req.params.id));
  } else {
    res.json({error:"No short URL found for the given input"});
  }
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', express.urlencoded({extended: true}), shorturlpostHandler);
app.get('/api/shorturl/:id', redirectHandler);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

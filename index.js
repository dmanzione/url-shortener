require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
// Basic Configuration
const port = process.env.PORT || 3000;
const shortid = require('shortid');
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

let shortieSchema = new mongoose.Schema(
  {
    originalUrl: {
			type: String,
			required:true
			},
    shortUrl:{
      type:String
    }
  }
);

let Shortie = mongoose.model('Shortie',shortieSchema);




app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: true}));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl",function(req, res){



  dns.lookup(req.hostname, function(err, family, addresses){
    if(err){
      let urls = { error: 'invalid url' };
      res.json(urls);
      return;
    }



  });
  let s = shortid.generate();


  let newShortie = new Shortie({
    originalUrl:req.body.url,
    shortUrl: s
  });

  newShortie.save(function(err, data){
    if(err)return console.log(err);




  });



   let urls =  {
     "original_url":req.body.url,
     "short_url":s
   }
s

   res.json(urls);

});

app.get("/api/shorturl/:shortparam",function(req, res){
  let shortUrl = req.params.shortparam;

  Shortie.findOne({"short_url":
      shortUrl
  },function(err,data){
    if(err) return console.log(err);

    res.redirect(data.originalUrl);

	});
  

});







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

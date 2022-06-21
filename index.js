require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
// Basic Configuration

const port = process.env.PORT || 3000;

let mongoose = require('mongoose');

mongoose.connect('mongodb+srv://dmanzione:12345-@freecodecamp.plgn94j.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
let shortieSchema = new mongoose.Schema(
  {
    original_url: {
			type: String,
			required:true
			},
    short_url:{
      type:String
    }
  }
);

let shortsSchema = new mongoose.Schema(
{
  set: [Number]
}

);


let Shortie = mongoose.model('Shortie',shortieSchema);
let Shorts = mongoose.model('Shorts',shortsSchema);

let collectionOfUrls = new Shorts({
  set: []
}
);



app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: true}));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.get('/api/clean',function(req, res) {
  Shortie.deleteMany(function(err, data){
    if(err) return console.log(err);
  });
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl",function(req, res){

let urlObj = new URL(req.body.url);
// try{
//   urlObj = new URL(req.body.url2);
//
//
// }catch(error){
//
//   res.json({ error: 'invalid url' });
//   return;
//
// }



  dns.lookup(urlObj.hostname, function(err, family, addresses){

    if(err){
      res.json({ error: 'invalid url' });


    }else {

      let newShortie;
        Shortie.findOne({original_url:req.body.url2},function(err, data){
          if(err) return console.log(err);

          if(data){
            let urls = {
              original_url:req.body.url,
              short_url:data.short_url
            };
            res.json({
              original_url:req.body.url,
              short_url:data.short_url
            });

          }else {

            let s = Math.floor(Math.random()*10000).toString();


            newShortie = new Shortie({
              original_url:req.body.url,
              short_url: s
            });
            newShortie.save(function(err3, data3){
              if(err3)return console.log(err3);
            });

            let urls ={
                original_url:req.body.url,
                short_url:s
              };
            res.json(  urls
            );
            // Shorts.find(function(err2, data2){
            //
            //   if(err2) return console.log(data2);
            //   let set = data2.set;
            //
            //   let s = Math.floor(Math.random()*10000);
            //   while(set.includes(s)){
            //     s = Math.floor(Math.random()*10000);
            //   }
            //
            //   newShortie = new Shortie({
            //     original_url:req.body.url2,
            //     short_url: s
            //   });
            //   newShortie.save(function(err3, data3){
            //     if(err3)return console.log(err3);
            //   });
            //   res.json(  {
            //       original_url:req.body.url2,
            //       short_url:s
            //     }
            //   );
            //
            //
            //
            //
            // });



          }
        });

    }







  });


});




app.get("/api/shorturl/:shortparam",function(req, res){
  let shortp = req.params.shortparam;


  Shortie.findOne({short_url: shortp},function(err,data){
    if(err) return console.log(err);
    if(data){

      res.redirect(data.original_url);
    }


	});

});



app.get("/api/shorturls", function(req, res){
  let arr = [];
  Shortie.find(function(err, data){
    if(err)return console.log(data)
    for(let i = 0;i<data.length;i++){
      arr[i] = data[i];
    }
    res.send(data)
  })


})







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

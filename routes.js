const path = require('path');
const dns = require('dns');
let urls = [];
module.exports = function (app, UrlModel) {

    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    })
    
    app.post("/api/shorturl", (req,res) => {
      var url = /^(http|https|ftp):\/\/([a-zA-Z0-9\-]*\.)*([a-zA-Z0-9]*\.){1,3}[a-zA-Z0-9]{2,5}\/*(\?*[a-zA-Z0-9]*=[a-zA-Z0-9]*)*$/;
      var regex = new RegExp(url);
      if(!req.body.url.match(regex)){
        res.json({ error: 'invalid url' })
        return;
      }else{
       /* dns.lookup(req.body.url.split("://")[1],(err,address,family) => {
          if(err){
            res.json({ error: 'invalid url' })
            return
          }else{*/
            UrlModel.findOne({}).sort({short_url: -1}).then( data => {
              if(data == undefined){
                const newUrl = new UrlModel({
                  original_url:req.body.url,
                  short_url:1
                });
                newUrl.save().then((err,doc)=>{
                  if(err) console.log(err);
                  res.json({'original_url': doc.original_url,'short_url':doc.short_url});
                });
              }else{
                UrlModel.findOneAndUpdate({original_url:req.body.url},{original_url:req.body.url,short_url:data.short_url+1},{
                  new: true,
                  upsert: true // Make this update into an upsert
                },(err,doc) => {
                  res.json({'original_url':doc.original_url,'short_url':doc.short_url})
                });
              }            
            });
          /*}
       // });*/
      }
    });

    app.get('/api/shorturl/:id', (req,res) => {
        UrlModel.findOne({short_url: parseInt(req.params.id)},(err,result) => {
          if(err) res.json({ error: 'invalid url' })
          res.redirect(`${result.original_url}`);
        });
    })
  }
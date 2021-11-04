const path = require('path');
const dns = require('dns');
const { url } = require('url');

module.exports = function (app, myDataBase) {

    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    })
    
    app.post("/api/shorturl", (req,res) => {

        const urlRegex = /^(http|https|ftp):\/\/([a-zA-Z0-9\-]*\.)*([a-zA-Z0-9]*\.){1,3}[a-zA-Z0-9]{2,5}\/*(\?*[a-zA-Z0-9]*=[a-zA-Z0-9]*)*$/;
        const regex = new RegExp(urlRegex);
        if(!req.body.url.match(regex)){
            res.json({ error: 'invalid url' })
            return;
        }else{
            const hostname = new URL(req.body.url).hostname
            dns.lookup(hostname,(err,address,family) => {
                if(err){
                    res.json({ error: 'invalid url' })
                    return console.log(address)
                }else{
                    myDataBase.find({}).sort({short_url:-1}).toArray((err,elements) => {
                        if(err){
                            return console.log(address)
                        }else{
                            if(elements === undefined){
                                const result = myDataBase.insertOne({'short_url':1,"original_url":req.body.url});
                                res.json({'original_url':req.body.url,'short_url':1});
                            } else {
                                //update the existed url
                                myDataBase.updateOne({original_url: req.body.url}, { $set: {short_url: elements[0].short_url+1}}).then((doc) => {
                                    // if the url exist and was modified find the url and respond with the json
                                    if(doc.modifiedCount) {
                                        myDataBase.find({original_url: req.body.url}).toArray( (err,element) => {
                                            res.json({'original_url':element[0].original_url,'short_url':element[0].short_url})
                                        });
                                    } else {
                                        //if the url doesn't exist insert it
                                        myDataBase.insertOne({'short_url':elements[0].short_url+1,"original_url":req.body.url});
                                        res.json({'original_url':req.body.url,'short_url':elements[0].short_url+1});  
                                    }
                                })
                            }
                        }
                    })                    
                }
            });
        }
    });

    app.get('/api/shorturl/:id', (req,res) => {
        // findone in db by index (1,2,3...)
        
        myDataBase.find({short_url: parseInt(req.params.id)}).toArray().then((err,result) => {
            if(err) res.json({ error: 'invalid url' });
            res.redirect(`${result[0].original_url}`);
        });
        //res.redirect(result.original_url);
        // Example of output: { "short_url": 2, "original_url": "url"}
        //res.json({'short_url':result.short_url,"original_url":result.original_url});
    })
  }
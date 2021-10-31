const path = require('path');

module.exports = function (app, myDataBase) {

    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    })
    
    app.post("/api/shorturl", (req,res) => {
        //TODO get the highest shorturl to increment by 1 but also certify if that already exist an equal url
        const cursor = myDataBase.find({}).sort({short_url:-1}).toArray((err, elements) => {
            console.log(elements[0].short_url)
            res.send("Testing input");
            if(elements.length) {
                const result = myDataBase.insertOne({'short_url':elements[0].short_url+1,"original_url":req.body.url});
                res.json({'original_url':req.body.url,'short_url':elements[0].short_url+1});      
            } else {
                const result = myDataBase.insertOne({'short_url':1,"original_url":req.body.url});
                res.json({'original_url':req.body.url,'short_url':1});           
            }
        });
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
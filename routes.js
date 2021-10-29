const path = require('path');

module.exports = function (app, myDataBase) {

    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    })
    
    app.post("/api/shorturl", (req,res) => {

        const cursor = myDataBase.find({});
        cursor.toArray().then(elements => {
            if(elements.length) {
                const result = myDataBase.insertOne({'short_url':elements.length+1,"original_url":req.body.url});
                res.json({'original_url':req.body.url,'short_url':elements.length+1});      
            } else {
                const result = myDataBase.insertOne({'short_url':1,"original_url":req.body.url});
                res.json({'original_url':req.body.url,'short_url':1});           
            }
        });
    });

    app.get('/api/shorturl/:id', (req,res) => {
        // findone in db by index (1,2,3...)
        const result = myDataBase.findOne({"short_url": req.params.id})
        res.redirect(result.original_url);
        // Example of output: { "short_url": 2, "original_url": "url"}
        //res.json({'short_url':result.short_url,"original_url":result.original_url});
    })
  }
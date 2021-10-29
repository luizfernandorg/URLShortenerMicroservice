const path = require('path');
const fs = require('fs');
const { Console } = require('console');

module.exports = function (app, myDataBase) {

    // Be sure to change the title
    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    })
    
    app.post("/api/shorturl", (req,res) => {
        // insert in db url
        const cursor = myDataBase.find({});
        cursor.toArray().then(ele => {
            if(ele.length) {
                const result = myDataBase.insertOne({'short_url':ele.length+1,"original_url":req.body.url});
                res.json({'short_url':ele.length+1,'original_url':req.body.url});      
            } else {
                const result = myDataBase.insertOne({'short_url':1,"original_url":req.body.url});
                res.json({'short_url':1,'original_url':req.body.url});           
            }
        });
    });

    app.get('/api/shorturl/:id', (req,res) => {
        // findone in db by index (1,2,3...)
        const result = myDataBase.findOne({"short_url": req.params.id})
        
        // {"_id":...., "index": 2, "url": "string"}
        //redirect to url from index
        res.json({'short_url':result.short_url,"original_url":result.original_url});
    })
  }
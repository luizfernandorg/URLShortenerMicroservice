const path = require('path');
module.exports = function (app, myDataBase) {

    // Be sure to change the title
    app.get("/", (req,res) => {
        res.sendFile(path.join(__dirname, 'views/index.html'));
    })
  
  }
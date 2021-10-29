const express = require("express");
require("dotenv").config();
const app = express();
const path = require('path')

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Listen on port " + PORT);
})
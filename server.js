// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('master.ejs');
});

app.use(express.static('web/'));

app.listen(9002);
console.log('run on 9002');
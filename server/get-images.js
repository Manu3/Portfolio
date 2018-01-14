var express = require('express');
var server = express();
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();
var bodyParser = require('body-Parser');
var {Users} = require('./models/users');
var routes = require('./routes/imagefile');
var request = require('request');
mongoose.connect('localhost', 'testing_storeImg');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



app.get('/images', function(req, res) {
//calling the function from index.js class using routes object..
routes.getImages(function(err, genres) {
if (err) {
throw err;

}
res.json(genres);

});
});

app.listen(3333, function (err) {
  //var address = server.address();
  console.error('server listening on 3333');

});

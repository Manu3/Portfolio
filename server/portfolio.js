const _ = require('lodash');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');
var app = express();
var port = process.env.PORT || 9090;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
				res.render('rental-cars',{
	});
});


app.post('/email', (req, res) => {
	var body = _.pick(req.body, ['name', 'email', 'message']);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
			    user: 'chattel6@gmail.com',
			    pass: 'chattel1234'
    }
  });
   //Setting up Email settings
       var mailOptions = {
           from: req.body.name,
           to : 'chattel6@gmail.com',
           subject: req.body.email,
           text : `your userid is ${req.body.email} and password is ${req.body.name}`,
       };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
			res.redirect('/');
    }
  });
});

app.listen(port, () => {
    console.log(`wow it started at port: ${port}`);
});

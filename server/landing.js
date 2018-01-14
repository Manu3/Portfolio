const nodemailer = require('nodemailer');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');
var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/users');
var {cars} = require('./models/cars');
var {myProfile} = require('./models/myProfile');

var app = express();
var port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
function: GET/
Purpose: to render the home page
URL: /
*/
app.get('/home', function (req, res) {
				res.render('landing',{
	});
});

app.get('/cars', (req, res) => {
    cars.find().then((cars) => {
        res.send({
            cars
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/myPortfolio', (req, res) => {
    myProfile.find().then((myProfile) => {
        res.send({
            myProfile
        });
				 // console.log('myProfile',myProfile);
    }, (err) => {
        res.status(400).send(err);
    });

});

/*
function: POST/email
Purpose: to send meesage from the anonymous user
URL: /email
*/
app.post('/sendMessage', (req, res) => {
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
           subject:`from ${req.body.name}`,
           html: `My email id is ${req.body.email}<p>${req.body.message}</p>`

       };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.redirect('/home');
    }
  });
});

/*
function: POST/signup
Purpose: Allows user to signup and send the credentials to the email.
URL: /signup
*/

app.post('/signup', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'password']);
  var user = new Users(body);
  user.save().then(() => {
    user.generateAuthToken();
    res.redirect('/home');
		var transporter = nodemailer.createTransport({
	    service: 'gmail',
	    auth: {
	          user: 'chattel6@gmail.com',
	          pass: 'chattel1234'
	    }
	  });
	   //Setting up Email settings
	       var mailOptions = {
	           from: 'chattel6@gmail.com',
	           to : req.body.email,
	           subject: 'Login credentials for Chatttel',
	           html : `<h3>Hi ${req.body.name},</h3> Thanks for signing with us. Your login id is ${req.body.email} and password is ${req,body.password}<p>Please visit https://localhost:9090/home/ and enjoy rides.</p>`,
	       };

	  transporter.sendMail(mailOptions, function(error, info){
	    if (error) {
	      console.log(error);
	    } else {
	      console.log('Email sent: ' + info.response);
	      res.redirect('/');
	    }
	  });
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      // popup.alert({
      //   content: 'User alredy registered'
      // });
      JSAlert.alert('User alredy registered');
      res.status(400).send(e);
    })
});

app.listen(port, () => {
    console.log(`wow it started at port: ${port}`);
});

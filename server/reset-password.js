const nodemailer = require('nodemailer');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');
var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var app = express();
var port = process.env.PORT || 9090;

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*
function: GET/users
Purpose: to render the home page
URL: /users
*/

app.get('/portfolio', (req, res) => {
    res.render('login');
   });
app.get('/users', function (req, res) {
				res.render('portfolio',{
	});
});



/*
function: POST/users/resetPassword
Purpose: Allows user to reset registered credentials.
URL: /users/resetPassword
*/
app.post('/users/resetPassword', (req, res) => {
	var body = _.pick(req.body, ['email']);

	Users.findUserByEmail(body.email).then((user) => {
		 // user.generateAuthToken().then((token) => {
		 user_ID = user._id;
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
    	           to : 'chattel6@gmail.com',
    	           subject: 'Login credentials for Chatttel',
    	           text : `localhost:9090/users/${user_ID}`,
    	       };

    	  transporter.sendMail(mailOptions, function(error, info){
    	    if (error) {
    	      console.log(error);
    	    } else {
    	      console.log('Email sent: ' + info.response);
    	      res.redirect('/');
    	    }
    	  });
		// 		res.header('x-auth', token).send(user);
		// 		//res.header('x-auth', token).send(`tokens are ${user.tokens[1].token}`);
    //
		// });
		res.redirect('/users');
	}).catch((e) => {
		res.status(400).send(e);
	});

});

/*
function: PATCH/users/id
Purpose: Allows user to update password.
URL: /users/login
*/

app.patch('/users/:user_ID', (req, res) => {
	//	console.log('user_ID', user_ID);
    var body = _.pick(req.body, ['password']);
		bcrypt.genSalt(10, (err, salt) => {
		  bcrypt.hash(body.password, salt, (err, hash) => {
				console.log('hashVal', hash);
				var hashedPassword = {'password': hash}

					Users.findByIdAndUpdate(id, {
							$set: hashedPassword
					}, {
							new: true
					}).then((user) => {
							if (!user) {
									return res.status(404).send();
							} else {
									res.send(user);
							}
					})

		  //  console.log('hashed passsword', hash);
		  });
		});
		//console.log('body', body.password);
});
app.listen(port, () => {
    console.log(`wow it started at port: ${port}`);
});

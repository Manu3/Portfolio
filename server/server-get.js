const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');
var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT || 9090;

const MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/users', function (req, res) {
	Users.find(function (err, docs) {
			//	console.log(docs);
				res.render('index',{
				title: 'Customers',
				userList: docs
		});
	});
});
app.get('/users/signin', function (req, res) {
	Users.find(function (err, docs) {
			//	console.log(docs);
				res.render('index-2',{
				title: 'Customers',
				userList: docs
		});
	});
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['name', 'email', 'password']);
  var user = new Users(body);
  user.save().then(() => {
    user.generateAuthToken();
    res.redirect('/users');
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

app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	Users.findByCredentials(body.email, body.password).then((user) => {
		  user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
      res.redirect('/users/signin');
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});
app.delete('/users/me/logout', authenticate, (req,res) => {
  var body = _.pick(req.body, ['x-auth']);
  req.user.removeToken(body.x-auth).then(() => {
    res.status(200).send();
  }).catch ((e) => {
    res.status(400).send();
  });
});

//GET users/id
app.get('/users/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid Id');
    } else {
        Users.findOne({
            _id: id
        }).then((newUser) => {
            if (!newUser) {
                res.status(404).send('Not found');
            } else {
                // to get complete object
                res.send({
                    newUser
                });
                // to get id
                //  res.send( req.params);
            }
        });
    }
});


// GET Private route <<<<--Authentication-->>>> users/me


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.listen(port, () => {
    console.log(`started at port: ${port}`);
});

module.exports = {
    app
};

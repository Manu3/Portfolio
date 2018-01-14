const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Users} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT || 9090;

const MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json());

/*
<<<<------ this is to validate the email and password from users model---->>>> --- Sign Up
*/

app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['name', 'email', 'password']);
	var user = new Users(body);
	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	})
	});


/*
<<<<<<<<--------Post/users/login------------>>>>>>>>>> {email, password}
*/
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	Users.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user)
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

/*
<<<<<<<<--------GET/users------------>>>>>>>>>> {name, _id, email}
*/
app.get('/users', (req, res) => {
    Users.find().then((users) => {
        res.send({
            users
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

/*
<<<<<<<<--------GET users/id------------>>>>>>>>>> {name, _id, email}
*/

app.get('/users/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid Id');
    } else {
        Users.findOne({
            _id: id
        }).then((User) => {
            if (!User) {
                res.status(404).send('Not found');
            } else {
                // to get complete object
                res.send({
                    User
                });
                // to get id
                //  res.send( req.params);
            }
        });
    }
});

/*
<<<<<<<<--------GET Private route <<<<--Authentication-->>>> users/me
*/

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


/*
<<<<<<<<--------UPDATE-------->>>> users/id
*/

app.patch('/users/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['name', 'completedAt']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } else {
        if (body.name != null) {
            body.completedAt = new Date().getTime();
        } else {
            //  body.completed = false;
            body.completedAt = null;
        }
    }
    Users.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((user) => {
        if (!user) {
            return res.status(404).send();
        } else {
            res.send(user);
        }
    })
});


/*
<<<<<<<<--------DELETE-------->>>> users/id
*/

app.delete('/users/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Users.findByIdAndRemove(id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }

        res.send({
            user
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

/*
function: removeToken
Purpose: LOGOUT -- removes the token
URL: users/id
*/
app.delete('/users/me/logout', authenticate, (req,res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch ((e) => {
    res.status(400).send();
  });
});
app.listen(port, () => {
    console.log(`started at port: ${port}`);
});

module.exports = {
    app
};

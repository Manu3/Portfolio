const {
    MongoClient,
    ObjectID
} = require('mongodb');
var express = require('express');
var bodyParser = require('body-Parser');
var path = require('path');
const _ = require('lodash');
var {
    mongoose
} = require('./db/mongoose');
var {
    Users
} = require('./models/users');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');
var app = express();
var port = process.env.PORT || 9090;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// app.post('/users', (req, res) => {
//     var newUser = new Users({
//         name: req.body.name
//     });
//     newUser.save().then((doc) => {
//         res.send(doc);
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });


//<<<<------ this is to validate the email and password from users model---->>>>
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['name', 'email', 'password']);
//   var user = new Users(body);
//
//   user.save().then((user) => {
//           res.send(user);
//       }).catch((e) => {
//           res.status(400).send(e);
//       });
// });

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

/// <<<<<<<<--------Post/users/login------------>>>>>>>>>> {email, password}
app.post('/users/login', (req,res) => {
var body = _.pick(req.body, ['email', 'password']);

Users.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    });
  }).catch ((e) => {
          res.status(400).send(e);
  });
});

app.listen(port, () => {
    console.log(`started at port: ${port}`);
});

module.exports = {
    app
};

const {
    MongoClient,
    ObjectID
} = require('mongodb');
var express = require('express');
var bodyParser = require('body-Parser');
var {
    mongoose
} = require('./db/mongoose');
var {
    Users
} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');
var app = express();
var port = process.env.PORT || 9090;

app.use(bodyParser.json());

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

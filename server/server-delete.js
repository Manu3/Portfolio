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
var app = express();
var port = process.env.PORT || 9090;

app.use(bodyParser.json());

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


app.listen(port, () => {
    console.log(`started at port: ${port}`);
});

module.exports = {
    app
};

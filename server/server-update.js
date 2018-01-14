const {
    MongoClient,
    ObjectID
} = require('mongodb');
const _ = require('lodash');
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
app.listen(port, () => {
    console.log(`started at port: ${port}`);
});

module.exports = {
    app
};

const {MongoClient,ObjectID}  = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/users');


// Users.remove({}).then((result) => {
//   console.log(result);
// });

Users.findOneAndRemove({_id: '5a2d165dff9469281e4cbaf7'}).then((user) => {
    console.log(user);
});

// Users.findByIdAndRemove('5a2cf55b678376b42201f8ae').then((user) => {
//     console.log(user);
// });

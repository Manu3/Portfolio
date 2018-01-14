// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID}  = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  //deleteMany
  // db.collection('Users').update({name:'Manu'}).then((result) => {
  //   console.log(result);
  // })

//deleteOne
  // db.collection('Users').deleteOne({address:'Hyderabad'}).then((err,result) => {
  //   if (err) {
  //     return console.log('no such data found');
  //   }
  //   console.log(result);
  // })

  // //fidOneAndDelete --->> will delete the first one in the collection
db.collection('Users').updateOne({
  _id: new ObjectID("5a2bac144eb76f268c5514cd"),
}, {
  $set:{
    name:'LALALAL'
  },$inc:{
    age:1,
  }
},{
  returnOriginal: false
}).then((result) => {
  console.log(result);
})
});

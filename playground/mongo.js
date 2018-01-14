
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/ManuKapoor', (err, db) =>   {
  if(err){
    return console.log(err);
  }
  console.log('connected to server');

db.collection('Users').insertOne({
  //  _id:12,
  name:"Manu",
  address:"Hyderabad"
},(err, result) => {
  if(err){
    return console.log(err);
  }
  console.log(result.ops[0]._id.getTimestamp());
});

  db.close();
});

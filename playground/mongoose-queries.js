const {MongoClient,ObjectID}  = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/users');
var id = '5a2cf55b678376b42201f8ae';

if(!ObjectID.isValid(id)){
  console.log('ID not valid');
}else{
  //find multiple records
  Users.find({
    _id:id
  }).then((doc) => {
    if(doc.length===0){
      console.log('ID not found');
    }else{
  console.log('Users: ', doc);
    }

  });

  //finds the record--- the first match
  Users.findOne({
    _id:id
  }).then((user) => {
    if(!user){
      console.log('ID not found');
    }else{
      console.log('User: ', user);
    }

  });

  // finds by id
  Users.findById(id).then((user) =>{
    if(!user){
      console.log('ID not found');
    }else{
      console.log('find by id: ', user);
    }
  });

}

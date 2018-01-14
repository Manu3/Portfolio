const mongoose = require('mongoose');
var email = mongoose.model('email',{
  name:{
    type:String,
    minlength:5,
    required: true,
    trim:true
  }
});
// 
// var newEmail = new email({
//   name: 'Astha Latawa',
// })
//
// newEmail.save().then((doc) => {
// console.log(JSON.stringify(doc, undefined, 2));
// }, (e) =>{
//   console.log(e);
// });

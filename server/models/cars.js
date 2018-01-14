var mongoose = require('mongoose');
var cars = mongoose.model('cars', {
  name:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  seater:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  rateWeekdays:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  rateWeekend:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  }

});
module.exports = {cars};

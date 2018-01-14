const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    trim:true
  },
  address:{
    type:String,
    minlength: 2,
    default:null
  },
  completedAt:{
    type: Number,
    default: null
  },
/*
<<<<------ this is to validate the email and password from users model---->>>>
*/
  email:{
      type:String,
      required: true,
      trim: true,
      minlength:5,
      unique:true,
      validator: {
        validator: validator.isEmail,
        message: '{Value} is not a valid email'
      }
  },
  password:{
    type:String,
    required: true,
    minlength:5
  },
  tokens:[{
    access:{
      type:String,
      required: true
    },
    token:{
      type:String,
      required: true
    }
  }]
});

/*
<<<<-----GET/users------>>>>>>>
*/
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  console.log(JSON.stringify(userObject));
  return _.pick(userObject, ['name', '_id', 'email','completedAt','password','tokens']);
};

UserSchema.methods.generateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, '123321').toString();

  user.tokens.push({access, token});

  return user.save().then (() => {
    return token;
  });
};
//<<<<-----Find by token------>>>>>>>//////
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, '123321');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

// hashing passwords
UserSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
        //console.log(`hash value is: ${hash}`);
      });
    });
  }else{
    next();
  }
});

///<<<<<<----find user login---------->>>>>>>>

UserSchema.statics.findByCredentials = function (email, password){
  var User = this;

  return User.findOne({email}).then((user) =>{
      if(!user){
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) =>{
            if(res){
              resolve(user);
            }else{
              reject();
            }
        })

      });
  });
};

///<<<<<<----find user for password reset---------->>>>>>>>

UserSchema.statics.findUserByEmail = function (email){
  var User = this;

  return User.findOne({email}).then((user) =>{
      if(!user){
        return Promise.reject();
      }
      return new Promise((resolve, reject) => {
        resolve(user);
      //  idVal = user._id;
      //  tokenVal =user.tokens[1].token;
      //  console.log('tokenVal is:', tokenVal);
      });
  });
};

///<<<<<<<<------------remove token --- logout --------------->>>>>>>>>

UserSchema.methods.removeToken = function (token){
  var user = this;
  return user.update({
    $pull:{
      tokens:{
        token
      }
    }
  });
};


var Users = mongoose.model('Users', UserSchema);
module.exports = {Users};

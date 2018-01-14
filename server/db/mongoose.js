const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/carsData');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://root:root@ds145669.mlab.com:45669/chattel');

//console.log('connect me');
module.exports = {mongoose };

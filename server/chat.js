const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
 const {isRealString} = require('./utils/validation');
 const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname,  '../public');
var app = express();
//we pass this server varialbe in app.listen to create server.
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

var port = process.env.PORT || 9090;

app.use(express.static(publicPath));
// to establish the server connection --- server is up/down
io.on('connection', (socket) =>{
  console.log('New user connected');
  /*
    socket.emit is used to emit message to the user who joins the chat.
    socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));
  */
  /*
    socket.broadcast.emit is used to emit message to all the users connected to the chat except to the sender.
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined the chat app'));
  */


  /*
    socket.on is used to read joining name and room of user who joins the chat.
  */


  socket.on('join', (params, callback) => {
   if (!isRealString(params.name) || !isRealString(params.room)) {
     return callback('Name and room name are required.');
   }
   socket.join(params.room);
   // to remove the user from other rooms and add to the new room
   users.removeUser(socket.id);
   users.addUser(socket.id, params.name, params.room);
   io.to(params.room).emit('updateUserList', users.getUserList(params.room));

   //socket.leave('room name');
   //io.emit -> io.to('room 1').emit
   //socket.broadcast.emit -->> socket.broadcast.to('room name').emit
   socket.emit('newMessage',generateMessage('Admin', 'Welcome to the chat app'));
   socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} joined the chat app`));
   callback();
 });
  /*
    io.emit is used to emit message to all the users connected to the chat.
  */
//   socket.on('createMessage', (message, callback) =>{
//     console.log('New message', message);
//     io.emit('newMessage',generateMessage(message.from, message.text));
//   // var user = users.getUser(socket.id);
//   // if(user && isRealString(message.text)){
//   //     io.to(user.room).emit('newMessage',generateMessage(user.name, message.text));
//   // }
//
//   callback('this is from the server');
// });

socket.on('createMessage', (message, callback) => {
  var user = users.getUser(socket.id);

  if (user && isRealString(message.text)) {
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
  }

  callback();
});
// to emit and send location

socket.on('createLocationMessage', (coords) => {
var user = users.getUser(socket.id);
if (user) {
  io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
});
// to establish the server connection --- server is up/down
socket.on('disconnect', () =>{
    console.log('User disconnected from server');

    var user = users.removeUser(socket.id);
    if(user){

      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }

  });
});
server.listen(port, () => {
  console.log(`app is running on port ${port}`);
});

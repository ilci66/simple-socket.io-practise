const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

console.log(Server)

app.use('/', express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// If you want to send a message to everyone 
//except for a certain emitting socket, 
//we have the broadcast flag for emitting from that socket:

// io.on('connection', (socket) => {
//   socket.broadcast.emit('hi');
// });

var clients = 0
var pickedUsername = "Anonymous"

io.on('connection', (socket) => {
  // console.log(socket.id)
  clients++;
  console.log('a user connected, clients: ',  clients);

  socket.on('disconnect', () => {
    clients--;
    console.log('a user disconnected, clients ',  clients);
    io.emit('client count', clients)
  });

  io.emit('client count', clients)

  socket.on('username chosen', (username) => {
    let user = { id: socket.id, username}
    pickedUsername = username
    socket.broadcast.emit('user joined', `${user.username} joined the chat`)
  });

  socket.on('chat message', (msg) => {
    var formattedMsg = `${pickedUsername}: ${msg}`
    io.emit('chat message', formattedMsg);
  });


});

server.listen(3000, () => {
  console.log('listening on: 3000');
});
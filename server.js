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
var users = {}
var pickedUsername = "Anonymous"

io.on('connection', (socket) => {
  // console.log(socket.id)
  clients++;
  console.log('a user connected, clients: ',  clients);

  socket.on('disconnect', () => {
    clients--;
    console.log('a user disconnected, clients ',  clients);
    io.emit('client count', clients)
    socket.broadcast.emit('user disconnected', users[socket.id])
  });

  io.emit('client count', clients)

  socket.on('username chosen', (username) => {
    users[socket.id] = username
    socket.broadcast.emit('user joined', `${users[socket.id]} joined the chat`)
  });

  socket.on('chat message', (msg) => {
    if(!users[socket.id]) users[socket.id] = "Unknown"
    var formattedMsg = `${users[socket.id]}: ${msg}`
    io.emit('chat message', formattedMsg);
  });

});

server.listen(3000, () => {
  console.log('listening on: 3000');
});
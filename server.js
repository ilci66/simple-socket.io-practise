const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

console.log(Server)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// io.on('connection', (socket) => {
//   console.log('a user connected');
// });

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

// If you want to send a message to everyone 
//except for a certain emitting socket, 
//we have the broadcast flag for emitting from that socket:

// io.on('connection', (socket) => {
//   socket.broadcast.emit('hi');
// });

var clients = 0
io.on('connection', (socket) => {
  clients++;
  console.log('a user connected, clients: ',  clients);

  socket.on('disconnect', () => {
    clients--;
    console.log('a user disconnected, clients ',  clients);
    io.emit('client count', clients)
  });

  io.emit('client count', clients)

  socket.on('chat message', (msg) => {
    // console.log('reached the emitted message by user: ' + msg)
    
    // send the message to everyone, including the sender.
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on: 3000');
});
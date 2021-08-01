//decided not to do it this way

// const { username, room } = Qs.parse(location.search, {
//   ignoreQueryPrefix: true,
// });
// console.log("username from query", username)

// console.log("QS", Qs.parse(location.search, {ignoreQueryPrefix: true,}))

//no need to specify url, it defaults to trying 
//to connect to the host that serves the page.
var socket = io();

var nick = "Unknown"

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var usernameForm = document.getElementById('username-form');
var usernameInput = document.getElementById('username-input');
var input = document.getElementById('input');
var userCount = document.getElementById('user-count')

// window prompt method
// var username = prompt('Write your username please')
// socket.emit('username chosen', username)


usernameForm.addEventListener('submit', (e) => {
  e.preventDefault()
  nick = usernameInput.value
  console.log("nick >>>",nick)
  socket.emit('username chosen', usernameInput.value)
  usernameInput.value = ""
});
socket.on('username chosen', username => {
  console.log(username)
  nick = username
})

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});
// picking the message emitted by server.js here
socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user joined', (text) => {
  console.log(text)
  var item = document.createElement('li');
  item.textContent = text;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
})

socket.on('user disconnected', username => {
  console.log('disc user >>>', username)
  var item = document.createElement('li');
  if(!username){
    var username = "Unknown"
  }
  item.textContent = `${username} disconnected`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
})

socket.on('client count', (clients) => {
  console.log("count in index", clients)
  userCount.textContent = `Number of online users: ${clients}`

})
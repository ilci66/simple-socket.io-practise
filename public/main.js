const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username)
console.log("QS", Qs.parse(location.search, {ignoreQueryPrefix: true,}))

//no need to specify url, it defaults to trying 
//to connect to the host that serves the page.
var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var userCount = document.getElementById('user-count')

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

socket.on('client count', (clients) => {
  console.log("count in index", clients)
  userCount.textContent = `Number of online users: ${clients}`

})
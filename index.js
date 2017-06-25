#!/usr/bin/env node

var net = require('net'),
JsonSocket = require('json-socket');
var SOCKET_LIST = {};
function getDateTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return hour + ":" + min + ":" + sec;

}

var log = function(msg) {
  var timestamp = getDateTime();
  console.log("["+timestamp+"] "+msg);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var port = 9838;
var server = net.createServer();
server.listen(port);
server.on('connection', function(socket) {
    socket.id = getRandomInt(100000000, 999999999)+Object.keys(SOCKET_LIST).length;
    SOCKET_LIST[socket.id] = new JsonSocket(socket);
    log("A server [id:"+socket.id+"] has connected.")
    socket.on('close', function() {
      log("A server [id:"+socket.id+"] has disconnected.")
      delete SOCKET_LIST[socket.id];
    });
    socket.on('message', function(message) {
        if (message.command == 'start') {
          streamInterval = setInterval(function() {

          }, 1000);
        } else if (message.command == 'stop') {
          clearInterval(streamInterval);
        }
    });
});

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();

rl.on('line', (line) => {
  var args = [];
  args = line.split(" ");
  var command = args[0];
  switch (command) {
    case 'serverinfo':
      var serverid = args[1];
      var sock = SOCKET_LIST[serverid];
      log('IP: '+sock.remoteAddress);
      break;
    default:
      log('Unknown command');
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});

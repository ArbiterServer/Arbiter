var net = require('net'),
JsonSocket = require('json-socket');
var si = require('systeminformation');

var port = 9838; //The same port that the server is listening on
var host = '0.0.0.0';
var socket = new JsonSocket(new net.Socket()); //Decorate a standard net.Socket with JsonSocket
socket.connect(port, host);
socket.on('connect', function() { //Don't send until we're connected
    socket.sendMessage({command: 'start'});
    socket.on('message', function(msg) {
        if(msg.command == "sysinfo") {
          si.mem(function(memo) {
            console.log(memo.total);
          });
        }
    });
});

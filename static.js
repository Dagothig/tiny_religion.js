var SERVER_PORT = process.env.PORT || 1337;

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

app.use(express.static(__dirname + '/'));

// Now we are configured let's start listening
server.listen(SERVER_PORT);
console.log("Server listening on port", SERVER_PORT);

var express = require('express');
var sys = require("sys");
var util = require('util');
var http = require("http");
var io = require("socket.io");


app = express.createServer();

app.listen(8080);


app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


var socket = io.listen(app);
var people = {};

socket.on('connection', function(client) {
  client.on('message', function(message){ 
    // Update the locations of all known people on the map
    people[client.sessionId] = message;
    // set timeout variable somewhere

    // debug crap
	sys.puts(client.sessionId); sys.puts(util.inspect(message)); sys.puts(' '); 
  });
  client.on('disconnect', function(){ sys.puts("client disconnected"); });
});



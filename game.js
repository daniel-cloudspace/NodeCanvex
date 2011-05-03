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

socket.on('connection', function(client) {
  client.on('message', function(message){ sys.puts(client.sessionId); sys.puts(util.inspect(message)); sys.puts(' '); }) 
  client.on('disconnect', function(){ sys.puts("client disconnected"); }) 
});



var sys = require("sys");
var util = require('util');
var http = require("http");
var io = require("socket.io");
var url = require('url');
var fs = require('fs');

function getFileExtension(filename) {
	return filename.split('.').pop();
}
var mime_types = { 
	'js': 'text/javascript',
	'html': 'text/html',
	'svgz': 'image/svg+xml'
};

server = http.createServer(function(req, res) {
	var path = url.parse(req.url).pathname;
	sys.puts(path);
	
	switch(path) {
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<h1>Nothin\'.</h1>');
			res.close();
			break;
		default:  
			fs.readFile(__dirname + path, function(err, data){
				sys.puts(util.inspect(mime_types));
				res.writeHead(200, {'Content-Type': mime_types[getFileExtension(path)]})
				res.write(data, 'utf8');
				res.end();
			});
			break;
	}
}),

send404 = function(res){
  res.writeHead(404);
  res.write('404');
  res.end();
};


server.listen(8080);


var socket = io.listen(server);

socket.on('connection', function(client) {
  client.on('message', function(message){ sys.puts(util.inspect(message)); }) 
  client.on('disconnect', function(){ sys.puts("client disconnected"); }) 
});



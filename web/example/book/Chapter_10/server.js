//npm install -g connect
//npm install -g socket.io
var http = require('http');
var server = http.createServer();
server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end(); });
server.listen(4000);

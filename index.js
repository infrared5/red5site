var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

var port    = process.env.PORT || 9797;
var app = connect();
app.use(serveStatic(__dirname));

http.createServer(app).listen(port);
console.log('Accepting connections on port ' + port + '...');

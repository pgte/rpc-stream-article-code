#!/usr/bin/env node

var store = require('./store');
var server = require('http').createServer();

var port = parseInt(process.argv[2]) || 8000;
server.listen(port);

server.once('listening', function() {
  console.log('Server is listening on port %d', port);
});

/// Static file serving

var static = require('node-static');
var file = new (static.Server)(__dirname + '/browser');
server.on('request', function(req, res) {

  if (req.url == '/lists/new') {
    var id = store.create();
    console.log('created to-do list with id', id);
    res.end(id);
    return;
  }

  file.serve(req, res, function(err) {
    if (err) {
      if (err.status == 404 && ~req.headers.accept.split(',').indexOf('text/html')) {
        file.serveFile('/index.html', 200, {}, req, res);
      } else {
        console.error('error processing request %s %s:', req.method, req.url, err);
        res.statusCode = err.status;
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({error: { message: err.message}}));
      }
    }
  });
});

// Websockets

var websockets = require('./websockets');
websockets.install(server);
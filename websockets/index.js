var shoe = require('shoe');

exports.install =
function install(server) {

	var sock = shoe(require('./list'));
	sock.install(server, '/list/websocket');

};
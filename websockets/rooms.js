var rooms = {};

exports.room = room;

function room(roomName) {
	var room = rooms[roomName];
	if (room) return room;

	room = {
		clients: []
	};


	// add client to room

	room.add = add;

	function add(client, stream) {
		room.clients.push(client);

		// when stream ends, remove client
		stream.once('end', onStreamEnd);


		function onStreamEnd() {
			var index = room.clients.indexOf(client);
			if (index >= 0) room.clients.splice(index, 1);
		}
	}

	// broadcast

	room.broadcast = broadcast

	function broadcast(method) {
		console.log('broadcasting to %d clients', room.clients.length);
		var args = Array.prototype.slice.call(arguments, 1);
		room.clients.forEach(function(client) {
			client[method].apply(client, args);
		});
	}

	rooms[roomName] = room;

	return room;
}
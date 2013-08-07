var rpc   = require('rpc-stream');
var store = require('../store');
var uuid  = require('node-uuid').v4;
var rooms = require('./rooms');


module.exports =
function listWebsocketServer(stream) {

  var listId;
  var room;
  var client;
  var remote;

  var interface = {

    list: function(args, cb) {
      var id = args[0];
      if (! id) return;

      listId = id;
      room = rooms.room(listId);
      room.add(remote, stream);
      var todos = store.get(id);
      cb(null, todos);
    },

    create: function(args, cb) {
      var todo = args[0];
      if (todo) {
        // assign an id to the item
        todo.id = uuid();

        // set it to pending
        todo.state = 'pending';

        // store item
        var items = store.get(listId);
        items.unshift(todo);

        // send new to the client
        room.broadcast('create', todo);
      }

      cb();
    },

    remove: function(args, cb) {
      var todoId = args[0];
      if (todoId) {
        var items = store.get(listId);

        // try to find the item in the list
        var index = find(items, todoId);

        // if the item is found, remove it
        if (index >= 0) {
          items.splice(index, 1);
          room.broadcast('remove', todoId);
        }
      }

      cb();
    },

    update: function(args, cb) {
      var todo = args[0];
      if (todo) {
        var items = store.get(listId);
        var index = find(items, todo.id);
        if (index >= 0) {
          items[index] = todo;
          room.broadcast('update', todo);
        }
      }
      cb();
    }
  };

  client = rpc(interface);
  remote = client.wrap(['create', 'remove', 'update']);

  client.pipe(stream).pipe(client);
}

function find(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id == id) return i;
  }
  return -1;
}
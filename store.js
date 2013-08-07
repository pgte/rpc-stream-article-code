var uuid = require('node-uuid').v4;

var store = {};

// create

exports.create = create;

function create() {
  var id = uuid();
  console.log(id);
  store[id] = [];
  return id;
}

// get

exports.get = get;

function get(id) {
	var items = store[id];
	if (! items) items = store[id] = [];
  return items;
}

// remove

exports.remove = remove;

function remove(id) {
  delete store[id];
}
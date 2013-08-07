global.ListCtrl = ListCtrl;

function ListCtrl($scope, Websocket, $routeParams) {

	$scope.newtodo = {};
	$scope.todos = [];

	var client = {

		create: function(args, cb) {
			var todo = args[0];
			if (todo) {
				$scope.todos.unshift(todo);
				$scope.$digest();
			}
			cb();
		},

		remove: function(args, cb) {
			todoId = args[0];
			if (todoId) {
				var index = find($scope.todos, todoId);
				if (index >= 0) {
					$scope.todos.splice(index, 1);
					$scope.$digest();
				}
			}
			cb();
		},

		update: function(args, cb) {
			var todo = args[0];
			if (todo) {
				var index = find($scope.todos, todo.id);
				if (index >= 0) {
					$scope.todos[index] = todo;
					$scope.$digest();
				}
			}
			cb();
		}

	};

	var remotes = ['list', 'create', 'remove', 'update'];

	Websocket.connect(client, remotes, $scope, '/list/websocket', function(server) {

		server.list($routeParams.listId, onTodos);
		function onTodos(err, todos) {
			if (err) throw err;
			$scope.todos = todos;
			$scope.$digest();
		}

		$scope.create = onCreate;
		function onCreate() {
			server.create($scope.newtodo, defaultCallback);
			$scope.newtodo = {};
		}

		$scope.remove = onRemove;
		function onRemove(todo) {
			server.remove(todo.id, defaultCallback);
		}

		$scope.toggle = onToggle;
		function onToggle(todo) {
			todo.state = todo.state == 'pending' ? 'done' : 'pending';
			server.update(todo, defaultCallback);
		}

	});
}

function find(items, id) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].id == id) return i;
  }
  return -1;
}

function defaultCallback(err) {
	if (err) throw err;
}
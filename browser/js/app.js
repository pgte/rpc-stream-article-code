var App = angular.module('ToodooApp', []);

App.config(function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.
    when('/', {
      templateUrl: '/partials/index.html'
    }).
    when('/lists/new', {
      templateUrl: '/partials/new.html',
      controller: 'NewListCtrl'
    }).
    when('/lists/:listId', {
      templateUrl: '/partials/list.html',
      controller: 'ListCtrl'
    });
});


/// Web Sockets

var reconnect = require('reconnect');
var rpc       = require('rpc-stream');

App.factory('Websocket', function() {

  function connect(interface, remotes, scope, path, cb) {
    var r =
    reconnect(function(stream) {

      scope.$on('$destroy', function() {
        r.reconnect = false;
        stream.end();
      });

      var client = rpc(interface);

      client.pipe(stream).pipe(client);

      var remote = client.wrap(remotes);

      cb(remote);
    }).connect(path);
  }

  return {
    connect: connect
  };

});
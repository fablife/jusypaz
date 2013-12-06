var app = angular.module('jusypazApp', [
        'ngAnimate',
        'adminControllers',
        'jusypazFilters',
        'adminServices',
        'ui.bootstrap',
        'ngRoute']);


angular.module('jusypazFilters', []).
  filter('newline2br', function() {
    return function(text) {
      return String(text).replace(/\n/g, '<br />');
    }
  }
);

var adminServices = angular.module('adminServices', ['ngResource']);
     
adminServices.factory('Usuario', ['$resource',
  function($resource){
    return $resource('admin/usuarios/:usuarioId.json', {}, {
    query: {method:'GET', params:{usuarioId:'usuarios'}, isArray:true}
    });
  }]);

adminServices.factory('Postulado', ['$resource',
  function($resource){
    return $resource('admin/postulados/:postuladoId.json', {}, {
    query: {method:'GET', params:{postuladoId:'postulados'}, isArray:true}
    });
  }]);

/*
adminServices.factory('PostuladoService', ['$http', function($http) {
  var posts = [];
  var server_queried = false;
  console.log("running PostuladoService")
  var promise;
  return {
     postulado_info: function(postulado_id) {
       if(!promise || !server_queried) {
         promise = $http.get('/postulados/' + postulado_id )
            .then(function(postulado, status, headers, config) {
            console.log("PostuladoService returned ok.")  
            server_queried = true;
            console.log(postulado[0]);
            return postulado[0];            
        })
        .error(function(data, status, headers, config){
        
        });
       }
       return promise;
     }
  };
}])
*/

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'admin/partials/index',
        controller: 'AdminCtrl'
      }).
      when('/informes', {
        templateUrl: 'admin/partials/informes',
        controller: 'AdminCtrl'
      }).
       when('/informe', {
        templateUrl: 'admin/partials/informe',
        controller: 'AdminCtrl'
      }).
      when('/adminUsers', {
        templateUrl: 'admin/partials/users',
        controller: 'AdminCtrl'
      }).
      when('/adminPostulados', {
        templateUrl: 'admin/partials/postulados',
        controller: 'AdminCtrl'
      }).
      when('/postulados/:postuladoId', {
        templateUrl: 'partials/postulado' /*,
        controller: 'PostuladoCtrl' */
      }).
      otherwise({
        redirectTo: '/index'
      });
}]);


app.controller("ConsultaCtrl", function ConsultaCtrl($scope, $http) {
  $scope.consulta_cedula = function() {
    window.location.href = "#/postulados/" + $scope.cedula;
  }
});


app.controller("MenuCtrl", function MenuCtrl($scope, $http) {

  $scope.show_submenu = false; 
  $scope.animate_menu = function() {
    $scope.show_submenu = true;1
  }

  $scope.hide_menu = function() {
    $scope.show_submenu = false;
  }

  $scope.admin_postulados = function() {
    location.href = "#/adminPostulados";
  }

  $scope.admin_users = function() {
    location.href = "#/adminUsers";
  }

  $scope.logout = function() {
    location.href = "/logout";
  }
});



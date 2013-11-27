var app = angular.module('jusypazNormalApp', [
        'ngAnimate',
        'ui.bootstrap',
        'ngRoute']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'partials/postulado'
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
  $scope.logout = function() {
    location.href = "/logout";
  }
});


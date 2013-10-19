var adminApp = angular.module('jusypazAdminApp', [
    'ngRoute',
    'adminControllers']);



adminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/create_user', {
        templateUrl: 'admin/partials/create_user',
        controller: 'AdminCtrl'
      }).
      when('/index', {
        templateUrl: 'admin/partials/index',
        controller: 'AdminCtrl'
      }).
      otherwise({
        redirectTo: 'admin/index'
      });
}]);

adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('AdminCtrl', ['$scope', '$http',
  function AdminCtrl($scope, $http) {
    $scope.create_user = function() {
      location.href = '/admin#create_user';
    };
}]);

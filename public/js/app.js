var app = angular.module('jusypazApp', ['ngAnimate']);

app.controller('HechosCtrl', function TableroCtrl($scope, $http) {
});

app.controller("MenuCtrl", function MenuCtrl($scope, $http) {

  $scope.animateJyp = false; 
  $scope.animate_menu = function() {
    $scope.animateJyp = true;
  }

  $scope.hide_menu = function() {
    $scope.animateJyp = false;
  }
});



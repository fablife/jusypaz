var app = angular.module('jusypazApp', []);

app.controller('TableroCtrl', function TableroCtrl($scope, $http) {
  //  var serviceUrl = "/consulta/cedula";
    var serviceUrl = "/consulta_cedula";

  $scope.admin_index = function() {
    location.href = '/admin#index';
  };

  $scope.consulta_cedula = function() {
    $scope.result = "";
    data = '{"cedula": "' + $scope.cedula + '"}';
    $http.post(serviceUrl, data)
      .success(function (data, stat, headers, config) {
        location.href = "/hechos/" + $scope.cedula
    }).error(function(response) { 
        $scope.result = response;
    });
  };
});


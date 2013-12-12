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
      when('/config', {
        templateUrl: 'partials/config'
      }).
      when('/message', {
        templateUrl: 'partials/message'
      }).
      otherwise({
        redirectTo: '/index'
      });
}]);

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
  $scope.config = function() {
    location.href = "#/config";
  }
  $scope.message = function() {
    location.href = "#/message";
  }
});

app.controller("MessageCtrl", function MenuCtrl($scope, $http) {

  $scope.subject = "";
  $scope.message = "";

  $scope.send_message = function() {
    if ($scope.subject.length < 1) {
      $scope.root.error = "Por favor agreguele un asunto al mensaje!";
      return
    }
    if ($scope.message.length < 1) {
      $scope.root.error = "El mensaje no puede ser vacío!";
      return;
    }
    $http({
            method : 'POST',
            url : '/send_message',
            data : 'subject=' + $scope.subject + '&message=' + $scope.message,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function() {
            $scope.root.notification = "Mensaje enviado con éxito.";
            location.href = "#/";
        }).error(function(data) {
            $scope.root.error = "No se pudo mandar el mensaje. " + data; 
        }); 
  }

});

app.controller('RootCtrl', ['$scope', '$http', '$timeout',
    function RootCtrl($scope, $http, $timeout) {
        $scope.root = {};
        $scope.root.notification = false;
        $scope.root.error = false;

        $scope.$watch('root.notification', function() {
            $scope.show_message();
        });

        $scope.$watch('root.error', function() {
            $scope.show_message();
        });

        $scope.show_message = function() {
            $timeout(function() {
                if ($scope.root.notification || $scope.root.error) {
                    $scope.root.notification = false;
                    $scope.root.error = false;
                    
                } else {
                    //$timeout.cancel(stop);
                }
            }, 2000);
        }

    }]);

app.controller("ConfigCtrl", function MenuCtrl($scope, $http) {

  $scope.show_change = false;
  $scope.invalid_form = false;

  $scope.pwd = function() {
    $scope.show_change = true;
  }

  $scope.cancel_pwd = function () {
    $scope.show_change = false;
  }

  $scope.change_pwd = function() {
    if ($scope.is_empty($scope.current) ) {
      $scope.root.error = "Contraseña actual no puede ser vacía!";
      return;
    }
    if ($scope.is_empty($scope.new_pass) ) {
      $scope.root.error = "Contraseña nueva no puede ser vacía!";
      return;
    }
    if ($scope.is_empty($scope.new_pass_confirm) ) {
      $scope.root.error = "Confirma contraseña nueva no puede ser vacía!";
      return;
    }

    if ($scope.new_pass === $scope.new_pass_confirm) {
      console.log($scope.pwd_change_form);

      $http({
            method : 'POST',
            url : '/minfo/pwd',
            data : 'current=' + $scope.current + '&new_pass_confirm=' + $scope.new_pass_confirm + '&new_pass=' + $scope.new_pass,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function() {
            $scope.root.notification = "Contraseña cambiada con éxito.";
        }).error(function(data) {
            $scope.root.error = "Error al cambiar contraseña: " + data; 
        }); 
    } else {
      $scope.root.error = "La nueva contraseña y su confirmación no coinciden!";
      return;
    }
  }

  $scope.is_empty = function(text) {
    if ((text == null) || (text == '')) {
      return true;
    } else {
      return false;
    }
  }
});


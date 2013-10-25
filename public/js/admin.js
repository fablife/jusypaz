var adminApp = angular.module('jusypazAdminApp', [
    'ngRoute',
    'adminControllers']);

adminApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/crea_postulado', {
        templateUrl: 'partials/postulado',
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
    $scope.nombres          = "Nombres";
    $scope.apellidos        = "Appellidos";
    $scope.cedula           = "Cédula";
    $scope.fecha_nacimiento = "Fecha nacimiento";
    $scope.estado_civil     = "Estado civil";
    $scope.direccion        = "Dirección";
    $scope.ciudad           = "Ciudad";
    $scope.telefono_fijo    = "Telefono fijo";
    $scope.telefono_movil   = "Telefono movil";
    $scope.correo           = "Correo electrónico";

    $scope.create_user = function() {
      location.href = '/admin#crea_postulado';
    };
  
}]);


// On esc event
adminApp.directive('onEsc', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attr.onEsc);
      }
    });
  };
});

// On enter event
adminApp.directive('onEnter', function() {
  return function(scope, elm, attr) {
    elm.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attr.onEnter);
      }
    });
  };
});

// Inline edit directive
adminApp.directive('inlineEdit', function($timeout) {
  return {
    scope: {
      model: '=inlineEdit',
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },
    link: function(scope, elm, attr) {
      var previousValue;

      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;

        $timeout(function() {
          elm.find('input')[0].focus();
        }, 0, false);
      };
      scope.save = function() {
        scope.editMode = false;
        scope.handleSave({value: scope.model});
      };
      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
    },
    templateUrl: 'partials/inline-edit'
  };
});


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

adminApp.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a class="inline_edit_action" ng-click="enableEditor()">Modificar</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input class="inline_edit_input" ng-model="view.editableValue">' +
            '<a ng-click="save()">Salvar</a>' +
            ' or ' +
            '<a class="inline_edit_action" ng-click="disableEditor()">Cancelar</a>.' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});

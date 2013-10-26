var adminApp = angular.module('jusypazAdminApp', [
    'ngRoute',
    'adminServices',
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
      when('/crea_hecho', {
        templateUrl: 'partials/hecho',
        controller: 'AdminCtrl'
      }).
      otherwise({
        redirectTo: 'admin/index'
      });
}]);

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


adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('AdminCtrl', ['$scope', '$http', 'Usuario', 'Postulado',
  function AdminCtrl($scope, $http, Usuario, Postulado) {
    $scope.notification = "";
    $scope.error = "";

    $scope.usuarios = Usuario.query()
    $scope.postulados = Postulado.query()

    $scope.post = {
        nombres:          'Nombres',
        apellidos:        'Apellidos',
        cedula:           'Cédula',
        fecha_nacimiento: "Fecha nacimiento",
        estado_civil:     "Estado civil",
        direccion:        "Dirección",
        ciudad:           "Ciudad",
        telefono_fijo:    "Telefono fijo",
        telefono_movil:   "Telefono movil",
        correo:           "Correo electrónico"
    };

    $scope.ver_hechos = function(cedula) {
      location.href = "/hechos/" + cedula;
    } 

    $scope.cancel = function() {
      $scope.notification = "";
      $scope.error = "";
    };

    $scope.create_postulado = function() {
      location.href = '/admin#crea_postulado';
    };
  
    $scope.crea_hecho = function() {
      location.href = '/admin#crea_hecho';
    };

    $scope.save_postulado = function() {
        $http.put('/admin/save_postulado',$scope.post).
           success(function() {
            $scope.notification = "Postulado salvado con éxito."; 
        }).error(function() {
            $scope.error = "Error al salvar el postulado."; 
        });
    };
}]);

var escape_function = function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attr.onEsc);
      }
    });
    /*
    elm.bind('blur', function(e) {
        scope.$apply(attr.onEsc);
    });
    */
  };
// On esc event
adminApp.directive('onEsc', function() {
    return escape_function;
});

/*adminApp.directive('onBlur', function() {
    return escape_function;
});
*/

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
          //elm.find('input')[0].focus();
          elm.find('input')[0].select();
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

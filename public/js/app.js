var app = angular.module('jusypazApp', [
        'ngAnimate',
        'adminControllers',
        'adminServices',
        'ngRoute']);

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

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/adminUsers', {
        templateUrl: 'admin/partials/users',
        controller: 'AdminCtrl'
      }).
      when('/adminPostulados', {
        templateUrl: 'admin/partials/postulados',
        controller: 'AdminCtrl'
      }).
      when('/index', {
        templateUrl: 'partials/tablero',
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

app.controller("MenuCtrl", function MenuCtrl($scope, $http) {

  $scope.show_submenu = false; 
  $scope.animate_menu = function() {
    $scope.show_submenu = true;
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
});


adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('AdminCtrl', ['$scope', '$http', 'Usuario', 'Postulado',
  function AdminCtrl($scope, $http, Usuario, Postulado) {
    $scope.notification = "";
    $scope.error = "";

    $scope.usuarios = Usuario.query()
    $scope.postulados = Postulado.query()

    $scope.add_user = function() {
        $scope.usuarios.push({
            dirty: true,
            name: null,
            cedula: null,
            password: null,
            rol: null
        });
    }

    $scope.add_postulado = function() {
        $scope.postulados.push({
            dirty: true,
            nombres: "Nombres",
            apellidos: "Apellidos",
            cedula: "Cédula",
            fecha_nacimiento: "Fecha de nacimiento",
            ciudad: "Ciudad"
        });
    }
    $scope.is_dirty = function(item){
       return item.dirty == true;
    }

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

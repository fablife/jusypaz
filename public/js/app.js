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


adminServices.factory('UploadService', ['$http', function($http) {
  console.log("running UploadService");
  return {
    beginUpload: function(files, options) {
        console.log("starting file upload at service");
        var fd = new FormData();
        for (var i in files) {
            fd.append("uploadedFile", files[i]);
        }
        for (var y in options) {
          fd.append(y, options[y]);
        }
        url = "/admin/postulados/" + options.post + "/docsupload";
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", this.onUploadProgress, false);
        xhr.addEventListener("load", this.onUploadComplete, false);
        xhr.addEventListener("error", this.onUploadFailed, false);
        xhr.addEventListener("abort", this.onUploadCanceled, false);
        xhr.open("POST", url);        
        xhr.send(fd);
    },
    onUploadProgress: function(progress) {
      console.log("upload progress");
    },
    onUploadComplete: function(result) {
      console.log("upload complete");
    },
    onUploadFailed: function(result) {
      console.log("upload failed");
    },
    onUploadCanceled: function(result) {
      console.log("upload canceled");
    }
  };
}])


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

  $scope.logout = function() {
    location.href = "/logout";
  }
});



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

adminServices.factory('NotificationService', [function() {
  
}]);

adminServices.factory('UploadService', [function() {
  
  function UploadService(scope) {  
    this.scope = scope;
    this.xhr = new XMLHttpRequest();
  }

  UploadService.prototype.beginUpload = function(files, options) {
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
    this.xhr.open("POST", url);        
    this.xhr.send(fd);
  }

  UploadService.prototype.onUploadProgress = function(callback) {
    var self = this;
    this.xhr.upload.addEventListener("progress", function (event) {      
       //Here you got the event object.
       self.scope.$apply(function(){
         callback(event);//Execute callback passing through the event object.
         //Since we want to update the controller, this must happen inside a scope.$apply function 
       });
    }, false);
  }

  UploadService.prototype.onUploadComplete = function(callback) {
    var self = this;
    this.xhr.addEventListener("load", function(event) {      
      //Here you got the event object.
      self.scope.$apply(function(){
        callback(event);//Execute callback passing through the event object.
        //Since we want to update the controller, this must happen inside a scope.$apply function 
      });
    }, false);
  }

  UploadService.prototype.onUploadFailed = function(callback) {
    var self = this;
    this.xhr.addEventListener("error", function(event) {
      //Here you got the event object.
      self.scope.$apply(function(){
        callback(event);//Execute callback passing through the event object.
        //Since we want to update the controller, this must happen inside a scope.$apply function 
      });
    }, false);
  }

  UploadService.prototype.onUploadCanceled = function(callback) {
    var self = this;
    this.xhr.addEventListener("abort", function(event) {
      //Here you got the event object.
      self.scope.$apply(function(){
        callback(event);//Execute callback passing through the event object.
        //Since we want to update the controller, this must happen inside a scope.$apply function 
      });
    }, false);
  }

  return UploadService;
}]);


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



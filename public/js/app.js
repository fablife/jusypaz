var app = angular.module('jusypazApp', [
        'ngAnimate',
        'adminControllers',
        'adminServices',
        'ui.bootstrap',
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
      when('/postulados/:postuladoId', {
        templateUrl: 'partials/postulado',
        controller: 'PostuladoCtrl'
      }).
      otherwise({
        redirectTo: '/index'
      });
}]);

var escape_function = function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 27) {
        scope.$apply(attr.onEsc);
      }
    });
  };
// On esc event
app.directive('onEsc', function() {
    return escape_function;
});

app.directive('onBlur', function() {
  return function(scope, elm, attr) {
    elm.bind('blur', function(e) {
        //scope.$apply(attr.onBlur);
    });
  };
});

// On enter event
app.directive('onEnter', function() {
  return function(scope, elm, attr) {
    elm.bind('keypress', function(e) {
      if (e.keyCode === 13) {
        scope.$apply(attr.onEnter);
      }
    });
  };
});

app.directive('onTab', function() {
  return function(scope, elm, attr) {
    elm.bind('keydown', function(e) {
      if (e.keyCode === 9) {
        scope.$apply(attr.onTab);
      }
    });
  };
});
// Inline edit directive
// Inline edit directive
app.directive('tabFormInputInlineEdit', function($timeout) {
    return get_inline_edit_widget($timeout, "text", "=tabFormInputInlineEdit", 'partials/tab-form-input-inline-edit');
});

app.directive('inputInlineEdit', function($timeout) {
    return get_inline_edit_widget($timeout, "text", '=inputInlineEdit', 'partials/input-inline-edit');
});

app.directive('inputInlineDate', function($timeout) {
    return get_inline_edit_widget($timeout, "date", '=inputInlineDate', 'partials/input-inline-date');
});

app.directive('inputInlinePassword', function($timeout) {
    return get_inline_edit_widget($timeout, "masked", '=inputInlinePassword', 'partials/input-inline-password');
});

get_inline_edit_widget = function($timeout, type, model, template) { 

  return {
    scope: {      
      model: model,
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },
    link: function(scope, elm, attr) {
      var previousValue;
      
      scope.tabindex = attr.tabindex;
      
      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;

        $timeout(function() {
          //elm.find('input')[0].focus();
          elm.find('input')[0].select();
        }, 0, false);
      };
      scope.tab = function() {
        scope.editMode = false;
        scope.handleSave({value: scope.model});
      };
      scope.save = function() {
        scope.editMode = false;
        if (type == "date") {
          if (/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(scope.model)) {
            scope.date_invalid = false;
          } else {
            scope.date_invalid = true;
          } 
        }
        scope.handleSave({value: scope.model});
      };
      scope.cancel = function() {
        scope.editMode = false;
        scope.model = previousValue;
        scope.handleCancel({value: scope.model});
      };
      scope.blur = function() {
        scope.editMode = false;
      }
    },
    templateUrl: template
  };
}

app.controller("PostuladoCtrl", function PostuladoCtrl($scope, $routeParams, $http){
  $scope.postulado_id = $routeParams.postuladoId;

  $scope.active = "hv";


  $scope.save = function() {
    switch($scope.active) { 
      case "hv": $scope.save_hr();
    }
    
  }
  $scope.hv = function() {
    $scope.active = "hv";
    $http.get('/postulados/' + $scope.postulado_id + "/hv").success(function(data, status, headers, config) {
      $scope.hoja = data[0];
      if (data.length == 0 ) {
        $scope.hoja = get_initial_hv_data();
      } else {
        delete $scope.hoja._id;
      }
    }).error(function(data, status, headers, config) {

    });
  }

  $scope.save_hr = function() {
    if ($scope.hoja.cedula === "undefined" || $scope.hoja.cedula == null) {
      $scope.hoja.cedula = $scope.postulado_id;
    }
    console.log($scope.hoja);
    $http.put('/admin/postulados/' + $scope.postulado_id + "/hv", $scope.hoja).
           success(function() {
            $scope.notification = "Hoja de vida salvada con éxito"; 
            //user.dirty = false;
        }).error(function() {
            $scope.error = "Error al salvar el postulado."; 
        });
  }

  $scope.jyp = function() {
    $scope.active = "jyp";
    $http.get('/postulados/' + $scope.postulado_id + "/jyp")
    .success(function(data, status, headers, config) {
      $scope.hv_data = data;
    })
    .error(function(data, status, headers, config){
        
    }); 
  }

  $scope.proc = function() {
    $scope.active = "proc";
    $http.get('/postulados/' + $scope.postulado_id + "/proc")
    .success(function(data, status, headers, config) {
      $scope.proc = data;
    })
    .error(function(data, status, headers, config){
        
    });
  }

  $scope.bienes = function() {
    $scope.active = "bienes";
    $http.get('/postulados/' + $scope.postulado_id + "/bienes")
    .success(function(data, status, headers, config) {
      $scope.bienes = data;
    })
    .error(function(data, status, headers, config){
        
    });
  }

  $scope.menores = function() {
    $scope.active = "menores";
    $http.get('/postulados/' + $scope.postulado_id + "/menores")
    .success(function(data, status, headers, config) {
      $scope.menores = data;
    })
    .error(function(data, status, headers, config){
        
    });
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
});


adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('AdminCtrl', ['$scope', '$http', 'Usuario', 'Postulado',
  function AdminCtrl($scope, $http, Usuario, Postulado) {
    $scope.notification = "";
    $scope.error = "";

    $scope.usuarios = Usuario.query()
    $scope.postulados = Postulado.query()

    $scope.getIndex = function(index,i) {
      return index*10 + i;
    }

    $scope.save_user = function(user) {
        $http.put('/admin/save_user', user).
           success(function() {
            $scope.notification = "Postulado salvado con éxito."; 
            user.dirty = false;
        }).error(function() {
            $scope.error = "Error al salvar el postulado."; 
        });
      
    }
    $scope.add_user = function() {
        $scope.usuarios.push({
            dirty: true,
            username: "Nombre",
            cedula: "00000000",
            password: "*******",
            role: "usuario" 
        });
    }

    $scope.view_postulado = function(postulado_id) {
      location.href = '#/postulados/' + postulado_id;
    }

    $scope.add_postulado = function() {
        $scope.postulados.push({
            dirty: true,
            nombres: "Nombres",
            apellidos: "Apellidos",
            cedula: "00000000",
            fecha_nacimiento: "01/12/1950",
            ciudad: "Ciudad"
        });
    }

    $scope.save_postulado = function(postulado) {
        $http.put('/admin/save_postulado', postulado).
           success(function() {
            $scope.notification = "Postulado salvado con éxito."; 
            postulado.dirty = false;
        }).error(function() {
            $scope.error = "Error al salvar el postulado."; 
        });
    };

    $scope.is_dirty = function(item){
       return item.dirty == true;
    }

    $scope.cancel = function() {
      $scope.notification = "";
      $scope.error = "";
    };

}]);


get_initial_hv_data = function() {
  return {
    estado_civil : "No especificado",
    alias : "No especificado",
    lugar_cedula : "No especificado",
    lugar_nacimiento : "No especificado",
    frente_bec : "No especificado",
    num_desmovil : "No especificado",
    licencia_cond : "No especificado",
    pasaporte : "No especificado",
    salud : "No especificado",
    clinica : "No especificado",
    otros_nombres : "No especificado",
    estatura       : "No especificado",
    peso  : "No especificado",        
    domicilio : "No especificado",
    residencia : "No especificado",
    fijo : "No especificado",
    celular : "No especificado",
    profesion : "No especificado",
    militar : "No especificado",
    grado : "No especificado",
    conyugue : "No especificado",
    madre : "No especificado",
    padre : "No especificado",
    hijos : "No especificado",
    hermanos : "No especificado",
    cuentas_ahorro : "No especificado",
    cuentas_corriente : "No especificado",
    tarjetas_credito : "No especificado",
    cdt : "No especificado",
    obligaciones_entidades : "No especificado",
    obligaciones_familiares : "No especificado",
    seguros_vida : "No especificado",
    inmuebles : "No especificado",
    muebles : "No especificado",
    sociedades : "No especificado",
    otros : "No especificado",
    bienes_fondo : "No especificado"
  }
}

var app = angular.module('jusypazApp', [
        'ngAnimate',
        'adminControllers',
        'adminServices',
        'ui.bootstrap',
        'ngRoute']);


var ModalCtrl = function ($scope, $modal, $log) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      //templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        /*items: function () {
          return $scope.items;
        }
        */
      }
    });

    modalInstance.result.then(function () {
      //$scope.selected = selectedItem;
    }, function () {
      
    });
  };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
  /*
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  */
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

angular.module('app', [], function() {})
FileUploadCtrl.$inject = ['$scope', '$timeout']
function FileUploadCtrl(scope, timeout) {
    //============== DRAG & DROP =============
    // source for drag&drop: http://www.webappers.com/2011/09/28/drag-drop-file-upload-with-html5-javascript/
    /*
    var dropbox = document.getElementById("dropbox")
    scope.dropText = 'Arrastre el archivo aqui';

    // init event handlers
    function dragEnterLeave(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        scope.$apply(function(){
            scope.dropText = 'Arrastre el archivo aqui'
            scope.dropClass = ''
        })
    }
    dropbox.addEventListener("dragenter", dragEnterLeave, false)
    dropbox.addEventListener("dragleave", dragEnterLeave, false)
    dropbox.addEventListener("dragover", function(evt) {
        evt.stopPropagation()
        evt.preventDefault()
        var clazz = 'not-available'
        var ok = evt.dataTransfer && evt.dataTransfer.types && evt.dataTransfer.types.indexOf('Files') >= 0
        scope.$apply(function(){
            scope.dropText = ok ? 'Drop files here...' : 'Only files are allowed!'
            scope.dropClass = ok ? 'over' : 'not-available'
        })
    }, false)
    dropbox.addEventListener("drop", function(evt) {
        console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)))
        evt.stopPropagation()
        evt.preventDefault()
        scope.$apply(function(){
            scope.dropText = 'Drop files here...'
            scope.dropClass = ''
        })
        var files = evt.dataTransfer.files
        if (files.length > 0) {
            scope.$apply(function(){
                scope.files = []
                for (var i = 0; i < files.length; i++) {
                    scope.files.push(files[i])
                }
            })
        }
    }, false)
    //============== DRAG & DROP =============
    */
    scope.subirVideo = false
    scope.video = null

    scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      scope.progressVisible = false
      });
      var label  = document.getElementById("uploadFileName"); 
      label.innerHTML = document.getElementById("fileToUpload").value;
    };

    scope.upload = function(elem) {
      var upload_btn = document.getElementById(elem);
      upload_btn.click();
    }

    scope.busca_video = function() {
      scope.subirVideo = true;
      scope.upload("videoToUpload");      
    }

    scope.upload_pic = function() {      
      scope.subirImagen = true;
      scope.upload("fileToUpload");
    }

    scope.uploadImagen = function() {
        var fd = new FormData()
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i])
        }
        fd.append("postuladoId",scope.postulado.cedula);
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadImgProgress, false)
        xhr.addEventListener("load", uploadImgComplete, false)
        xhr.addEventListener("error", uploadImgFailed, false)
        xhr.addEventListener("abort", uploadImgCanceled, false)
        xhr.open("POST", "/admin/postulados/" + scope.postulado.cedula + "/avatarupload")
        scope.progressVisible = true
        xhr.send(fd)
    }

    scope.ver_video = function() {
      if (scope.video === null) {
        scope.video   = document.createElement('video');
        scope.video.controls = "controls";
        var source  = document.createElement('source');        
        source.src  = "/videos/" + scope.delito.cedula + "/" + scope.delito._id + "/" + scope.delito.video_path;
        if (scope.delito.hora_mencion) {
          scope.video.addEventListener('loadedmetadata', function() {            
            this.currentTime = scope.delito.hora_mencion;
          }, false);          
        }
        source.type = "video/mp4";

        scope.video.appendChild(source);
        document.getElementById("video_container").appendChild(scope.video);
      }
      scope.play_video = true;
    }

    scope.cerrar = function() {
      scope.play_video = false;
      console.log(scope.play_video);
    }

    scope.uploadFile = function() {
        var fd = new FormData()
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i])
        }
        fd.append("postuladoId",scope.delito.cedula);
        fd.append("delitoId",scope.delito._id);
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "/admin/postulados/" + scope.delito.cedula + "/videoupload")
        scope.progressVisible = true
        xhr.send(fd)
    }

    function uploadProgress(evt) {
        scope.$apply(function(){
            if (evt.lengthComputable) {
                scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                scope.progress = 'no puedo evaluar progreso'
            }
        })
    }

    function uploadComplete(evt) {
        /* This event is raised when the server send back a response */
        scope.delito = evt.target.response   
        alert("Video subido con exito")
    }

    function uploadFailed(evt) {
        alert("Hubo un error al subir el archivo.")
    }

    function uploadCanceled(evt) {
        scope.$apply(function(){
            scope.progressVisible = false
        })
        alert("El usuario canceló subir el archivo o el browser cortó la conexión.")
    }

    function uploadImgProgress(evt) {
        scope.$apply(function(){
            if (evt.lengthComputable) {
                scope.progress = Math.round(evt.loaded * 100 / evt.total)
            } else {
                scope.progress = 'no puedo evaluar progreso'
            }
        })
    }

    function uploadImgComplete(evt) {
        /* This event is raised when the server send back a response */
        scope.postulado = evt.target.response        
        scope.subirImagen = false;
        alert("Video subido con exito")
    }

    function uploadImgFailed(evt) {
        scope.subirImagen = false;
        alert("Hubo un error al subir el archivo.")
    }

    function uploadImgCanceled(evt) {
        scope.subirImagen = false;
        scope.$apply(function(){
            scope.progressVisible = false
        })
        alert("El usuario canceló subir el archivo o el browser cortó la conexión.")
    }
}




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

/*
adminServices.factory('PostuladoService', ['$http', function($http) {
  var posts = [];
  var server_queried = false;
  console.log("running PostuladoService")
  var promise;
  return {
     postulado_info: function(postulado_id) {
       if(!promise || !server_queried) {
         promise = $http.get('/postulados/' + postulado_id )
            .then(function(postulado, status, headers, config) {
            console.log("PostuladoService returned ok.")  
            server_queried = true;
            console.log(postulado[0]);
            return postulado[0];            
        })
        .error(function(data, status, headers, config){
        
        });
       }
       return promise;
     }
  };
}])
*/

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/index', {
        templateUrl: 'admin/partials/index',
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

app.directive('inputInlineSelectCodigo', function($timeout) {
    return get_inline_edit_widget($timeout, "select", '=inputInlineSelectCodigo', 'partials/input-inline-select-codigo');
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
      codigos: "=codigos",
      tabindex: "@tabindex",
      model: model,
      handleSave: '&onSave',
      handleCancel: '&onCancel'
    },
    link: function(scope, elm, attr) {
      if (type == "select") {
        attr.$observe('opts',function(){
          scope.options = attr.opts;
          console.log(attr.opts);
        });
      }
      var previousValue;

      scope.edit = function() {
        scope.editMode = true;
        previousValue = scope.model;

        $timeout(function() {
          //elm.find('input')[0].focus();
          if (type == "select") {
            elm.find('select')[0].focus();
          } else {
            elm.find('input')[0].select();
          }
        }, 0, false);
      };
      scope.tab = function() {
        scope.editMode = false;
        if (previousValue != scope.model) {
          scope.handleSave({value: scope.model});
        }
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

//app.controller("PostuladoCtrl", function PostuladoCtrl(PostuladoService, $scope, $routeParams, $http){
app.controller("PostuladoCtrl", function PostuladoCtrl($scope, $routeParams, $http){
  $scope.postulado_id = $routeParams.postuladoId;
  $scope.create_delito = false;
  $scope.newdelitotitle = "";

  $scope.active = "hv";
  $scope.subtab_active = "jyp_delitos";
  console.log("postulado ctrl");

  $scope.set_dirty = function(model) { 
    $scope.delito.dirty = true;
  }
  //$scope.postulado = PostuladoService.postulado_info($scope.postulado_id );
  $http.get('/postulados/' + $scope.postulado_id )
        .success(function(postulado, status, headers, config) {
            console.log(postulado[0]);
            $scope.postulado = postulado[0];            
        })
        .error(function(data, status, headers, config){
        
        });

  $http.get('/codigopenal/')
            .success(function(codigos, status, headers, config) {
            console.log(codigos);
            $scope.codigos = codigos;
        })
        .error(function(data, status, headers, config){
        
        });

  $scope.save = function() {
    switch($scope.active) { 
      case "hv": $scope.save_hv();
      case "jyp": switch($scope.subtab_active) {
                    case "jyp_delitos": $scope.save_delito();
                  };
    }    
  }

  $scope.add_victima = function() {
    p = {};
    p.nombres         = "No especificado";
    p.apellidos       = "No especificado";
    p.perfil          = "No especificado";
    p.oficio          = "No especificado";
    p.enunciada_por   = "No especificado";
    p.datos_completos = "No especificado";

    $scope.delito.victimas.push(p);
  }

  $scope.add_participante = function() {
    p = {};
    p.nombres         = "No especificado";
    p.apellidos       = "No especificado";
    p.alias           = "No especificado";
    p.pertenencia     = "No especificado";
    p.confesado       = "No especificado";
    p.hora_mencion    = "No especificado";
    p.otros_implicados = [];
    p.participacion   = "No especificado";

    $scope.delito.participantes.push(p);
  }

  $scope.add_otro = function(participante) {
    p = {};
    p.nombres         = "No especificado";
    p.apellidos       = "No especificado";
    p.alias           = "No especificado";
    p.pertenencia     = "No especificado";
    p.participacion   = "No especificado";

    participante.otros_implicados.push(p);
  }

  $scope.add_delito = function() {
    $scope.create_delito = true;
  }

  $scope.crea_delito = function() {
    $scope.create_delito = false;
    console.log($scope.newdelitotitle);
    var json = '{ "titulo": "' + $scope.newdelitotitle + '"}';    
    $http.put('/admin/postulados/' + $scope.postulado_id + "/jyp", json).
     success(function(data, status, headers, config) {
      $scope.delito = data;
      console.log($scope.delito);
      $scope.newdelitotitle = "";
      $scope.delitos.push($scope.delito);
    }).error(function(data, status, headers, config) {

    });
  }

  $scope.cancela_crea_delito = function() {
    $scope.create_delito = false;
    console.log($scope.newdelitotitle);
    $scope.newdelitotitle = "";
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

  $scope.save_hv = function() {
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

  $scope.save_delito = function() {
   if ($scope.delito.cedula === "undefined" || $scope.delito.cedula == null) {
     $scope.delito.cedula = $scope.postulado_id;
    }
    delete $scope.delito._id;
    $http.put('/admin/postulados/' + $scope.postulado_id + "/jyp_delito", $scope.delito).
           success(function() {
            $scope.notification = "Información delito salvada con éxito"; 
            $scope.delito.dirty = false;
        }).error(function() {
            $scope.error = "Error al salvar la información del delito."; 
        });
  }


  $scope.get_delito = function(index) {
    $scope.delito = $scope.delitos[index];
    $scope.selectedDelitoIndex = index;
  }

  $scope.jyp_delitos = function() {
    $scope.active = "jyp";
    $http.get('/postulados/' + $scope.postulado_id + "/jyp_delitos")
    .success(function(data, status, headers, config) {
      $scope.delitos = data;      
      $scope.delito = $scope.delitos[0];
      $scope.selectedDelitoIndex = 0;
      console.log($scope.delitos);
      console.log($scope.delitos.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error al salvar el postulado."; 
    }); 
  }

  $scope.jyp_fosas = function() {
    $scope.active = "jyp";
    $http.get('/postulados/' + $scope.postulado_id + "/jyp_fosas")
    .success(function(data, status, headers, config) {
      $scope.fosas = data;      
      $scope.fosa = $scope.fosas[0];
      $scope.selectedFosaIndex = 0;
      console.log($scope.fosas);
      console.log($scope.fosas.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error al salvar el postulado."; 
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

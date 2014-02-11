
adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('RootCtrl', ['$scope', '$http', '$timeout',
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

        $scope.show_messages = function() {            
            $http.get("/admin/get_messages")
                .success(function(messages, status, headers, config) {
                    console.log("Query for all message data successful");
                        if (messages.length > 0 ) {
                            $scope.root.messages = messages;
                    }
                })
                .error(function(data, status, headers, config){        
                    $scope.root.error = "No pude bajar la lista de mensajes!";
                });

            $scope.root.new_messages = "";
            location.href = "#/messages";
        }

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

        $http.get("/admin/messages")
            .success(function(message, status, headers, config) {
                console.log("Query for all message data successful");
                if (message.length > 0 ) {
                    $scope.root.new_messages = "Tienes nuevos mensajes!";
                }
        })
        .error(function(data, status, headers, config){
        
        });

    }]);

adminControllers.controller('AdminCtrl', ['$scope', '$http', 'Usuario', 'Postulado',
  function AdminCtrl($scope, $http, Usuario, Postulado) {    

    $scope.usuarios = Usuario.query()
    $scope.postulados = Postulado.query()

    $scope.show_detail_msg = false;
    $scope.informe_chosen = false;
    $scope.current_msg = false;
    $scope.show_add_codigo_dialog = false;

/*
    $scope.$on('$routeChangeSuccess', function(evt, current, previous) {
        var diagram = document.getElementById("diagram_holder");
        if (diagram && current.$$route.originalPath != "/informes") {
            diagram.remove();
        }
    });
*/
    if (!$scope.root.codigos) {
        $http.get('/codigopenal/')
            .success(function(codigos, status, headers, config) {
            console.log(codigos);
            $scope.root.codigos = codigos;
        })
        .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo descargar la lista de codigo penales para delitos!";
        });
    }

    $scope.add_codigo = function() {
        $scope.show_add_codigo_dialog = true;
    }

    $scope.delete_codigo = function(codigo) {
        var yes = confirm("Está seguro de querer eliminar este codigo?");

        if (yes == true) {         
          $http.delete("/admin/codigopenal/" + codigo._id).
            success(function() {
            $scope.root.notification = "Codigo penal eliminado con éxito.";
            var idx = -1;
            for (var i in $scope.root.codigos) {
                if ($scope.root.codigos[i]._id == codigo._id) {
                    idx = i;
                    break;
                }
            }
            if (idx > -1) {
                $scope.root.codigos.splice(idx, 1);
            }
          }).error(function() {
            $scope.root.error = "Error al eliminar el codigo."; 
          });
        }

    }

    $scope.cancel_codigo = function() {
        $scope.show_add_codigo_dialog = false;
    }

    $scope.save_codigo = function() {
        var codigo = $scope.root.new_codigo_text;
        $scope.show_add_codigo_dialog = false;
        $http({
            url: "/admin/codigopenal/new",
            method: "POST",
            data: "codigo=" + codigo,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(new_codigo) {
                $scope.root.notification = "Nuevo código agregado con éxito.";
                $scope.root.codigos.push(new_codigo);
            }).error(function(data, status, headers, config) {
                $scope.root.error = "Error al agregar el nuevo código.";
            });
    }

    $scope.show_msg = function(msg) {
        $scope.current_msg = msg;
        console.log(msg);
        console.log(msg._id);
        $http.post("/admin/messages/" + msg._id, {}).
            success(function() {
                msg.read = true;
            }).error(function(data, status, headers, config) {
                console.log("Actually, couldn't set message as 'read'");
            });
        $scope.show_detail_msg = true;
    }

    $scope.delete_msg = function(msg) {
        $http.delete("/admin/messages/" + msg._id).
            success(function() {
                $scope.root.notification = "Mensaje eliminado con éxito.";
                var idx = -1;
                for (var i in $scope.root.messages) {
                    if ($scope.root.messages[i]._id == msg._id) {
                        idx = i;
                        break;
                    }
                }
                if (idx > -1) {
                    $scope.root.messages.splice(idx, 1);
                }
                }).error(function(data, status, headers, config) {
                    $scope.root.error = "No se pudo eliminar el mensaje.";;
                });
    }

    $scope.close_msg = function(msg) {
        $scope.show_detail_msg = false;
    }    

    $scope.set_dirty = function(user) {
        user.dirty = true;
    }

    $scope.set_p_dirty = function(postulado) {
        postulado.dirty = true;
    }

    $scope.choose_general = function() {
        $http.get("/admin/informe")
            .success(function(objetos, status, headers, config) {
                console.log("Query for general informe successful");
                $scope.root.informe_general = objetos;
                console.log(objetos);                
                location.href = "#/informe_general";
        })
        .error(function(data, status, headers, config){
            $scope.root.error = "No se pudo acceder a la información necesaria para el informe!";
        });
    }

    $scope.choose_individual = function() {
        $scope.informe_chosen = true;
        $scope.root.informe_general = false;
    }

    $scope.informe_postulado = function(postulado) {
        $http.get("/admin/postulados/" + postulado.cedula + "/informe")
            .success(function(objetos, status, headers, config) {
                console.log("Query for all postulado data successful");
                $scope.root.objetos_informe = objetos;
                $scope.root.postulado_informe = postulado;
                console.log(objetos);                
                location = "#/informe"

        })
        .error(function(data, status, headers, config){
            $scope.root.error = "No se pudo acceder a la información necesaria para el informe!";
        });
    }

    $scope.getIndex = function(index,i) {
      return index*10 + i;
    }

    $scope.save_user = function(user) {
        $http.put('/admin/save_user', user).
           success(function() {
            $scope.root.notification = "Postulado salvado con éxito."; 
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

    $scope.informes = function() {
        location.href = "#/informes";    
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
            $scope.root.notification = "Postulado salvado con éxito."; 
            postulado.dirty = false;
        }).error(function() {
            $scope.root.error = "Error al salvar el postulado."; 
        });
    };

    $scope.delete_postulado = function(postulado) {
        var yes = confirm("Está seguro de querer eliminar este postulado?");

        if (yes == true) {         
          $http.delete("/admin/delete_postulado/" + postulado._id).
            success(function() {
            $scope.root.notification = "Postulado eliminado con éxito.";
            var idx = -1;
            for (var i in $scope.postulados) {
                if ($scope.postulados[i]._id == postulado._id) {
                    idx = i;
                    break;
                }
            }
            if (idx > -1) {
                $scope.postulados.splice(idx, 1);
            }
          }).error(function() {
            $scope.root.error = "Error al eliminar el postulado."; 
          });
        }
    }

    $scope.delete_user = function(usuario) {
        var yes = confirm("Está seguro de querer eliminar este usuario?");
        if (yes == true) {         
          $http.delete("/admin/delete_user/" + usuario._id).
            success(function() {
            $scope.root.notification = "Postulado eliminado con éxito.";            
            var idx = -1;
            for (var i in $scope.usuarios) {
                if ($scope.usuarios[i]._id == usuario._id) {
                    idx = i;
                    break;
                }
            }
            if (idx > -1) {
                $scope.usuarios.splice(idx, 1);
            }
          }).error(function(data) {
            $scope.root.error = "Error al eliminar el postulado:\n" + data; 
          });
        }
    }

    $scope.is_dirty = function(item){
       return item.dirty == true;
    }

    $scope.cancel = function() {
      $scope.root.notification = "";
      $scope.root.error = "";
    };

}]);

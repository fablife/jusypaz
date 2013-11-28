
adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('AdminCtrl', ['$scope', '$http', 'Usuario', 'Postulado',
  function AdminCtrl($scope, $http, Usuario, Postulado) {
    $scope.notification = "";
    $scope.error = "";

    $scope.usuarios = Usuario.query()
    $scope.postulados = Postulado.query()

    $scope.set_dirty = function(user) {
        user.dirty = true;
    }

     $scope.set_p_dirty = function(postulado) {
        postulado.dirty = true;
    }


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

    $scope.delete_postulado = function(postulado) {
        var yes = confirm("Está seguro de querer eliminar este postulado?");

        if (yes == true) {         
          $http.delete("/admin/delete_postulado/" + postulado._id).
            success(function() {
            $scope.notification = "Postulado eliminado con éxito.";
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
            $scope.error = "Error al eliminar el postulado."; 
          });
        }
    }

    $scope.delete_user = function(usuario) {
        var yes = confirm("Está seguro de querer eliminar este usuario?");
        if (yes == true) {         
          $http.delete("/admin/delete_user/" + usuario._id).
            success(function() {
            $scope.notification = "Postulado eliminado con éxito.";
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
          }).error(function() {
            $scope.error = "Error al eliminar el postulado."; 
          });
        }
    }

    $scope.is_dirty = function(item){
       return item.dirty == true;
    }

    $scope.cancel = function() {
      $scope.notification = "";
      $scope.error = "";
    };

}]);
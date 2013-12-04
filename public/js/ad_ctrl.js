
adminControllers = angular.module('adminControllers',[]);

adminControllers.controller('AdminCtrl', ['$scope', '$http', 'Usuario', 'Postulado',
  function AdminCtrl($scope, $http, Usuario, Postulado) {
    $scope.notification = "";
    $scope.error = "";

    $scope.usuarios = Usuario.query()
    $scope.postulados = Postulado.query()
    $scope.root = {}

    $scope.informe_chosen = false

    $scope.set_dirty = function(user) {
        user.dirty = true;
    }

    $scope.set_p_dirty = function(postulado) {
        postulado.dirty = true;
    }

    $scope.choose_general = function() {
        location.href = "#/informe_general";
    }

    $scope.choose_individual = function() {
        $scope.informe_chosen = true;
    }

    $scope.informe_postulado = function(postulado) {
        $http.get("/admin/postulados/" + postulado.cedula + "/informe")
            .success(function(objetos, status, headers, config) {
                console.log("Query for all postulado data successful");
                $scope.root.objetos_informe = objetos;
                console.log(objetos);
                $scope.build_visualization(objetos, postulado);
                location = "#/informe"

        })
        .error(function(data, status, headers, config){
        
        });
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

    $scope.build_visualization = function(objects, postulado) {

        var width = 500,
        height = 500,
        radius = Math.min(width, height) / 2;

        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);

        var y = d3.scale.sqrt()
            .range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");


        var partition = d3.layout.partition()
            .value(function(d) { return d.size; });

        var arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

        $scope.get_diagram_data(objects, postulado, function(error, root) {
          var path = svg.selectAll("path")
              .data(partition.nodes(root))
            .enter().append("path")
              .attr("d", arc)
              .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
              .on("click", click);

          function click(d) {
            path.transition()
              .duration(750)
              .attrTween("d", arcTween(d));
          }

          var g = svg.selectAll("g")
            .data(partition.nodes(root))
            .enter().append("g");

        var path = g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
            .on("click", null);

        var text = g.append("text")
              .attr("x", function(d) { return y(d.y); })
              .attr("dx", "6") // margin
              .attr("dy", ".35em") // vertical-align
              .text(function(d) { return d.name; });
        });

        


        d3.select(self.frameElement).style("height", height + "px");

    }

    $scope.get_diagram_data = function(objects, postulado, callback) {
        error = null;
        children = []
        
        
        root = {}
        var total = 0;
        for (var i in objects) {
            total += objects[i].length;
        }

        for (var i in objects) {
            if (objects.hasOwnProperty(i)) {
                subchild = $scope.get_children_for_model(i, objects[i]);
                var json = {"name" : i , "children": subchild};
                children.push(json);
            }
        }
        root = {
            "children": children
        }
        console.log(root);

        callback(error, root)
    }

    $scope.get_children_for_model = function(model, objects) {
        switch(model) {
            case "Delito" : return $scope.get_delito_children(objects);
                            break;
            case "Fosa"   : return $scope.get_fosa_children(objects);
                            break;
            default:        return $scope.get_fake_children();
                            break;
        }
    }


    $scope.get_fake_children = function() {
        children = [];
        for (var i=0; i<4; i++) {
            children.push({"name" : "Bla", size: 3});
        }
        return children;
    }

    $scope.get_delito_children = function(objects) {
        assoc = [];
        objects.forEach(function(obj) {
            console.log("looop");
            //console.log (obj);
            if (typeof assoc[obj.codigo_penal] == 'undefined') {
                console.log("setting");
                assoc[obj.codigo_penal] = 0;
            }
            console.log("assigning");
            assoc[obj.codigo_penal] += 1;
        });
        children = [];
        console.log("assoc.leng" + assoc.length);
        for (var i in assoc) {
            if (assoc.hasOwnProperty(i)) {
                children.push({"name" : i, "size" : assoc[i]});
            }
        }

        return children;
    }

    $scope.get_fosa_children = function(objects) {
        enunciada = 0
        no = 0;
        objects.forEach(function(obj) {
            if (obj.enunciada) {
                enunciada += 1;
            }else {
                no += 1;
            }
        });
        children = [];
        children.push({"name" : "Enunciadas", size: enunciada});
        children.push({"name" : "No Enunciadas", size: no});

        return children;
    }


}]);






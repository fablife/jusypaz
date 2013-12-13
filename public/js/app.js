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
      when('/config', {
        templateUrl: 'partials/config'
      }).
      when('/messages', {
        templateUrl: 'admin/partials/messages',
        controller: 'AdminCtrl'
      }).
      when('/adminCodigos', {
        templateUrl: 'admin/partials/codigos',
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

app.controller("DiagramCtrl", function DiagramCtrl($scope, $http) {
  var objetos = $scope.root.objetos_informe;
  var p = $scope.root.postulado_informe;  

  $scope.build_visualization = function(objects, postulado) {

        var width = 500,
        height = 600,
        radius = Math.min(width, height) / 2;

        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);

        var y = d3.scale.sqrt()
            .range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.select("#diagram_wrapper").append("div")
            .attr("id", "diagram_holder")
            .attr("class", "centered")
            .append("svg")
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
            $scope.root.diagram_json = root;
            var g = svg.selectAll("g")
                .data(partition.nodes(root))
                .enter().append("g");

            var path = g.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                .on("click", click);

            var text = g.append("text")
                .attr("x", function(d) { return y(d.y); })
                .attr("dx", function(d) { if (d.level==1) {return "-100"} else { return "-20"}}) // margin
                .attr("dy", ".35em") // vertical-align
                //.text(function(d) { if (d.size || (d.children && (d.children.length > 0) ) )  return d.name; });
                .text(function(d) { 
                  if (hasChildren(d) || d.size > 0) {
                    return d.name;
                  } 
                });

            text.attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; });

            function computeTextRotation(d) {
                var angle = x(d.x + d.dx / 2) - Math.PI / 2;
                return angle / Math.PI * 180;
            }

            function hasChildren(d) {
              var has = false;
              if (d.children) {
                d.children.forEach(function(i) {
                  if (i.size > 0) {
                    has = true;
                    return true;
                  }
                }); 
              }
              return has;
            }
            /*
            function click(d) {
                path.transition()
                .duration(750)
                .attrTween("d", arcTween(d));
            }
            */
            function click(d) {
              // fade out all text elements
              text.transition().attr("opacity", 0);

              path.transition()
                .duration(750)
                .attrTween("d", arcTween(d))
                .each("end", function(e, i) {
                    // check if the animated element's data e lies within the visible angle span given in d
                    if (e.x >= d.x && e.x < (d.x + d.dx)) {
                      // get a selection of the associated text element
                      var arcText = d3.select(this.parentNode).select("text");
                      // fade in the text element and recalculate positions
                      arcText.transition().duration(750)
                        .attr("opacity", 1)
                        .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
                        .attr("x", function(d) { return y(d.y); });
                    }
                });
            }


            // Interpolate the scales!
            function arcTween(d) {
              var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                  yd = d3.interpolate(y.domain(), [d.y, 1]),
                  yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
              return function(d, i) {
                return i
                    ? function(t) { return arc(d); }
                    : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
              };
            }
        });

       
        d3.select(self.frameElement).style("height", height + "px");

    }

    $scope.get_diagram_data = function(objects, postulado, callback) {
        var error = null;
        var children = []
        
        
        var root = {}
        var total = 0;
        for (var i in objects) {
            total += objects[i].length;
        }

        for (var i in objects) {
            if (objects.hasOwnProperty(i)) {
                var subchild = $scope.get_children_for_model(i, objects[i]);
                var json = {"name" : i , 'level':1, "children": subchild};
                children.push(json);
            }
        }
        root = {
            //"name": postulado.nombres + " " + postulado.apellidos,
            "name": "",
            "children": children
        }
        console.log(JSON.stringify(root));

        callback(error, root)
    }

    $scope.get_children_for_model = function(model, objects) {
        switch(model) {
            case "Delito" : return $scope.get_delito_children(objects);
                            break;
            case "Fosa"   : return $scope.get_fosa_children(objects);
                            break;
            case "Proceso": return $scope.get_proc_children(objects);
                            break;
            case "RelacionesAutoridades": return $scope.get_relaut_children(objects);
                            break;
            case "OperacionesConjuntas" : return $scope.get_op_children(objects);
                            break;
            case "Bien":    return $scope.get_bien_children(objects);
                            break;
            case "Menor":   return $scope.get_menor_children(objects);
                            break;
            case "Parapolitica" : return $scope.get_pp_children(objects);
                            break;                            
            default:        return;
                            break;
        }
    }

    /*
    $scope.get_fake_children = function() {
        var children = [];
        for (var i=0; i<4; i++) {
            children.push({"name" : "Bla", size: 3});
        }
        return children;
    }
    */

    $scope.get_pp_children = function(objects) {
        var assoc = [];
        objects.forEach(function(obj) {
            //console.log("looop");
            //console.log (obj);
            if (typeof assoc[obj.tipo] == 'undefined') {
                //console.log("setting");
                assoc[obj.tipo] = 0;
            }
            //console.log("assigning");
            assoc[obj.tipo] += 1;
        });
        var children = [];
        //console.log("assoc.leng" + assoc.length);
        for (var i in assoc) {
            if (assoc.hasOwnProperty(i)) {
                children.push({"name" : i, "size" : assoc[i]});
            }
        }

        return children;
    }

    $scope.get_menor_children = function(objects) {
        var assoc = [];
        objects.forEach(function(obj) {
            //console.log("looop");
            //console.log (obj);
            if (typeof assoc[obj.status] == 'undefined') {
                //console.log("setting");
                assoc[obj.status] = 0;
            }
            //console.log("assigning");
            assoc[obj.status] += 1;
        });
        var children = [];
        //console.log("assoc.leng" + assoc.length);
        for (var i in assoc) {
            if (assoc.hasOwnProperty(i)) {
                children.push({"name" : i, "size" : assoc[i]});
            }
        }

        return children;
    }

    $scope.get_bien_children = function(objects) {
        var len = objects.length;
        children = [];
        children.push({"name" : "Cantidad", size: len});
    }

    $scope.get_op_children = function(objects) {
        var pn = 0;
        var autodef = 0;
        var ejercito = 0;

        objects.forEach(function(obj) {
            if (obj.tipo == "Grupos de autodefensa") {
                autodef += 1;
            } else if (obj.tipo == "Policia Nacional") {
                pn += 1;
            } else if (obj.tipo == "Ejercito") {
                ejercito += 1;
            }
        });
        children = [];
        if (autodef)
          children.push({"name" : "Grupos de autodefensa", size: autodef});
        if (pn)
          children.push({"name" : "Policia Nacional", size: pn});
        if (ejercito)
          children.push({"name" : "Ejercito", size: ejercito});
        return children;
    }

    $scope.get_relaut_children = function(objects) {
        var armada = 0;
        var ejercito = 0;
        var policia = 0;

        objects.forEach(function(obj) {
            if (obj.tipo == "Armada") {
                armada += 1;
            } else if (obj.tipo == "Policia") {
                policia += 1;
            } else if (obj.tipo == "Ejercito") {
                ejercito += 1;
            }
        });
        children = [];
        if (armada)
          children.push({"name" : "Armada", size: armada});
        if (policia)
          children.push({"name" : "Policia", size: policia});
        if (ejercito)
          children.push({"name" : "Ejercito", size: ejercito});
        return children;
    }

    $scope.get_proc_children = function(objects) {
        var jyp = 0;
        var ord = 0;

        objects.forEach(function(obj) {
            if (obj.tipo == "Justicia y Paz") {
                jyp += 1;
            } else {
                ord += 1;
            }
        });
        children = [];
        if (jyp)
          children.push({"name" : "Justicia y Paz", size: jyp});
        if (ord)
          children.push({"name" : "Justicia ordinaria", size: ord});

        return children;
    }

    $scope.get_delito_children = function(objects) {
        var assoc = [];
        objects.forEach(function(obj) {
            //console.log("looop");
            //console.log (obj);
            if (typeof assoc[obj.codigo_penal] == 'undefined') {
                //console.log("setting");
                assoc[obj.codigo_penal] = 0;
            }
            //console.log("assigning");
            assoc[obj.codigo_penal] += 1;
        });
        var children = [];
        //console.log("assoc.leng" + assoc.length);
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
        if (enunciada)
          children.push({"name" : "Enunciadas", size: enunciada});
        if (no)
          children.push({"name" : "No Enunciadas", size: no});

        return children;
    }

    $scope.build_visualization(objetos, p);
  
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

  $scope.informes = function() {
    location.href = "#/informes";
  }

   $scope.admin_codigos = function() {
        location.href = "#/adminCodigos";
    }

  $scope.config = function() {
    location.href = "#/config";
  }

  $scope.logout = function() {
    location.href = "/logout";
  }
});

app.controller("ConfigCtrl", function MenuCtrl($scope, $http) {

  $scope.show_change = false;
  $scope.invalid_form = false;

  $scope.pwd = function() {
    $scope.show_change = true;
  }

  $scope.cancel_pwd = function () {
    $scope.show_change = false;
  }

  $scope.change_pwd = function() {
    if ($scope.is_empty($scope.current) ) {
      $scope.root.error = "Contraseña actual no puede ser vacía!";
      return;
    }
    if ($scope.is_empty($scope.new_pass) ) {
      $scope.root.error = "Contraseña nueva no puede ser vacía!";
      return;
    }
    if ($scope.is_empty($scope.new_pass_confirm) ) {
      $scope.root.error = "Confirma contraseña nueva no puede ser vacía!";
      return;
    }

    if ($scope.new_pass === $scope.new_pass_confirm) {
      console.log($scope.pwd_change_form);

      $http({
            method : 'POST',
            url : '/minfo/pwd',
            data : 'current=' + $scope.current + '&new_pass_confirm=' + $scope.new_pass_confirm + '&new_pass=' + $scope.new_pass,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function() {
            $scope.root.notification = "Contraseña cambiada con éxito.";
        }).error(function(data) {
            $scope.root.error = "Error al cambiar contraseña: " + data; 
        }); 
    } else {
      $scope.root.error = "La nueva contraseña y su confirmación no coinciden!";
      return;
    }
  }

  $scope.is_empty = function(text) {
    if ((text == null) || (text == '')) {
      return true;
    } else {
      return false;
    }
  }
});


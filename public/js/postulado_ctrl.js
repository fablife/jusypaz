//app.controller("PostuladoCtrl", function PostuladoCtrl(PostuladoService, $scope, $routeParams, $http){
app.controller("PostuladoCtrl", function PostuladoCtrl($scope, $routeParams, $http){
  $scope.maintab  = {};
  $scope.subtab   = {};
  $scope.root.postulado_id    = $routeParams.postuladoId;
  
  $scope.root.create_delito   = false;
  $scope.root.newdelitotitle  = "";
  $scope.root.codigos = false;

  $scope.maintab.active = "hv";
  $scope.subtab.active = "jyp_delitos";

  $scope.root.opciones_status = [{status: "Desmovilizados"}, {status: "Entregados a las familias"}, {status: "Entregados al ICBF"}, {status: "Personal que militó siendo menor de edad"}];
  $scope.root.tipos_pp = [{nombre: "Gobernadores"}, {nombre: "Diputados"}, {nombre: "Congresistas"}, {nombre: "Alcaldes"}, {nombre: "Concejales"}, {nombre: "Camara de representates"}, {nombre: "Directivos de partidos políticos"}];
  $scope.root.tipos_relaut = [{nombre: "Ejercito"}, {nombre: "Armada"}, {nombre: "Policia"}];
  $scope.root.tipos_op_conjunta = [{nombre: "Grupos de autodefensa"}, {nombre: "Ejercito"}, {nombre: "Policia Nacional"}];
  $scope.root.tipos_proc = [{nombre: "Justicia y Paz"}, {nombre: "Justicia ordinaria"}];
  $scope.root.tipos_version = [{nombre: "Individual"}, {nombre: "Conjunta"}];
  $scope.root.grupos_armados = [{nombre: "Ejercito"}, {nombre: "Policia"}, {nombre: "Armada"}, {nombre: "Fuerza aérea"}, {nombre: "Autodefensa"}];
  $scope.root.civiles = [{nombre: "Soltero"}, {nombre: "Casado"}, {nombre: "Unión Libre"}, {nombre: "Separado"}, {nombre: "Viudo"}];
  $scope.root.paises = [{nombre: "Colombia"}, {nombre: "Panamá"}];
  $scope.root.colombia_depts = [{nombre: "Amazonas"}, {nombre: "Antioquia"}, {nombre: "Arauca"}, {nombre: "Atlántico"}, {nombre: "Bolivar"}, {nombre: "Boyacá"}, {nombre: "Caldas"}, {nombre: "Caquetá"}, {nombre: "Casanare"}, {nombre: "Cauca"}, {nombre: "Cesar"}, {nombre: "Chocó"}, {nombre: "Córdoba"}, {nombre: "Cundinamarca"}, {nombre: "Guainía"}, {nombre: "Guaviare"}, {nombre: "Huila"}, {nombre: "La Guajira"}, {nombre: "Magdalena"}, {nombre: "Meta"}, {nombre: "Nariño"}, {nombre: "Norte de Santander"}, {nombre: "Putumayo"}, {nombre: "Quindío"}, {nombre: "Risaralda"}, {nombre: "San Andrés y Providencia"}, {nombre: "Santander"}, {nombre: "Sucre"}, {nombre: "Tolima"}, {nombre: "Valle del Cauca"}, {nombre: "Vaupés"}, {nombre: "Vichada"}];
  $scope.root.panama_depts = [{nombre: "Panamá - Otros"}];
  $scope.root.fosa_depts = $scope.root.colombia_depts;
  $scope.root.delito_depts = $scope.root.colombia_depts;

  $scope.$watch('root.fosa.pais', function (newVal, oldVal, scope) {
    if(newVal == "Panamá") { 
      $scope.root.fosa_depts = $scope.root.panama_depts;
      $scope.root.fosa.departamento = $scope.root.panama_depts[0].nombre;
    } else if (newVal="Colombia") {
      $scope.root.fosa_depts = $scope.root.colombia_depts;
    }
  });

  $scope.not_empty = function(str) {
    return ((str != null) && (str.length > 0));
  }

  $scope.$watch('root.delito.pais', function (newVal, oldVal, scope) {
    if(newVal == "Panamá") { 
      $scope.root.delito_depts = $scope.root.panama_depts;
      $scope.root.delito.dept = $scope.root.panama_depts[0].nombre;
    } else if (newVal="Colombia") {
      $scope.root.delito_depts = $scope.root.colombia_depts;
    }
  });
  
  $scope.calc_age = function(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }


  $scope.set_dirty = function(model) { 
    $scope.root.delito.dirty = true;
  }

  $scope.set_hv_dirty = function(model) { 
    $scope.root.hoja.dirty = true;
  }

  $scope.set_fosa_dirty = function(model) {
    $scope.root.fosa.dirty = true;
  }

  $scope.set_bien_dirty = function(model) {
    $scope.root.bien.dirty = true;
  }

  $scope.set_menor_dirty = function(model) {
    $scope.root.menor.dirty = true;
  }

  $scope.set_pp_dirty = function(model) {
    $scope.root.parapolitica.dirty = true;
  }

  $scope.set_relaut_dirty = function(model) {
    $scope.root.relaut.dirty = true;
  }

  $scope.set_op_conjunta_dirty = function(model) {
    $scope.root.op_conjunta.dirty = true;
  }

  $scope.set_proc_dirty = function(model) {
    $scope.root.proc.dirty = true;
  }

  $scope.view_docs = function(area, id) {
    $http.get('/postulados/' + $scope.root.postulado_id + "/view_docs/" + area + "/" + id)
      .success(function(files, status, headers, config) {
            //console.log(files);
            $scope.showFiles = true;
            $scope.root.files = files;
            //$scope.root.postulado = postulado[0];            
        })
        .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo a la lista de documentos de " + area + "!";
          $scope.root.files = [];
          $scope.showFiles = true;
        });

  }

  $scope.close_browser = function() {
    $scope.showFiles = false;
  }
  //$scope.postulado = PostuladoService.postulado_info($scope.postulado_id );
  $http.get('/postulados/' + $scope.root.postulado_id )
        .success(function(postulado, status, headers, config) {
            console.log(postulado[0]);
            $scope.root.postulado = postulado[0];            
        })
        .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo descargar la lista de postulados!";
        });

  if (!$scope.root.codigos) {
    $http.get('/codigopenal/')
            .success(function(codigos, status, headers, config) {
            //console.log(codigos);
            $scope.root.codigos = codigos;
        })
        .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo descargar la lista de codigo penales para delitos!";
        });
  }

  $scope.save = function() {
    switch($scope.maintab.active) { 
      case "hv"     : $scope.save_hv();
                      break;
      case "bienes" : $scope.save_bien();
                      break;
      case "menores": $scope.save_menor();
                      break;
      case "proc"   : $scope.save_proc();
                      break;
      case "jyp":     switch($scope.subtab.active) {
                        case "jyp_delitos": $scope.save_delito();
                                        break;
                        case "jyp_fosas": $scope.save_fosa();
                                        break;
                        case "jyp_relauts": $scope.save_relaut();
                                        break;
                        case "jyp_op_conjuntas": $scope.save_op_conjunta();
                                        break;
                        case "jyp_parapoliticas": $scope.save_parapolitica();
                                        break;
                      };
                      break;
    }    
  }


  /*************************************************************************
    DELITOS
  *************************************************************************/

  $scope.add_victima = function() {
    p = {};
    p.nombres         = "No especificado";
    p.apellidos       = "No especificado";
    p.perfil          = "No especificado";
    p.oficio          = "No especificado";
    p.enunciada_por   = "No especificado";
    p.datos_completos = "No especificado";

    $scope.root.delito.victimas.push(p);
  }

  $scope.remove_victima = function(v) {
      var idx = -1;
      for (var i in $scope.root.delito.victimas) {
         if ($scope.root.delito.victimas[i] === v) {
             idx = i;
             break;
         }
      }
      if (idx > -1) {
        $scope.root.delito.victimas.splice(idx, 1);
      }
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
    p.participacion_datos  = "No especificado";
    p.autodefensa_bloque   = "No especificado";
    p.autodefensa_frente   = "No especificado";
    p.autodefensa_comandante   = "No especificado";
    p.autodefensa_mando    = "No especificado";

    $scope.root.delito.participantes.push(p);
  }

  $scope.remove_participante = function(p) {
      var idx = -1;
      for (var i in $scope.root.delito.participantes) {
         if ($scope.root.delito.participantes[i] === p) {
             idx = i;
             break;
         }
      }
      if (idx > -1) {
        $scope.root.delito.participantes.splice(idx, 1);
      }
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
    $scope.root.create_delito = true;
  }

  $scope.crea_delito = function() {
    $scope.root.create_delito = false;
    //console.log($scope.root.newdelitotitle);
    var json = '{ "titulo": "' + $scope.root.newdelitotitle + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_delito/c", json).
     success(function(data, status, headers, config) {
      $scope.root.delito = data;
      //console.log($scope.root.delito);
      $scope.root.newdelitotitle = "";
      $scope.root.delitos.push($scope.root.delito);
      $scope.root.selectedDelitoIndex = $scope.root.delitos.length -1;
      $scope.root.notification = "Nuevo delito creado con éxito";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "No se pudo crear el delito!";
    });
  }

  $scope.cancela_crea_delito = function() {
    $scope.root.create_delito = false;
    //console.log($scope.root.newdelitotitle);
    $scope.root.newdelitotitle = "";
  }  
  

  $scope.get_delito = function(index) {
    $scope.root.delito = $scope.root.delitos[index];
    $scope.root.selectedDelitoIndex = index;
  }

   $scope.save_delito = function() {
   if ($scope.root.delito.cedula === "undefined" || $scope.root.delito.cedula == null) {
     $scope.root.delito.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_delito/u", $scope.root.delito).
           success(function() {
            $scope.root.notification = "Información delito salvada con éxito"; 
            $scope.root.delito.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información del delito.");
            $scope.root.error = "Error al salvar la información del delito."; 
        });
  }

  $scope.jyp_delitos = function() {
    //console.log ("jyp_delitos selected");
    if ($scope.maintab.active == "hv") {
      return;
    }
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_delitos";
    $http.get('/postulados/' + $scope.root.postulado_id + "/jyp_delitos")
    .success(function(data, status, headers, config) {
      if (data.length > 0) {
        $scope.root.delitos = data;      
        $scope.root.delito = $scope.root.delitos[0];
        $scope.root.selectedDelitoIndex = 0;
        //console.log($scope.root.delitos);
        //console.log($scope.root.delitos.length);
      } else {
        $scope.root.delitos = [];
      }
    })
    .error(function(data, status, headers, config){
        $scope.root.error = "Error recibiendo los delitos de postulado."; 
    }); 
  }

  $scope.delete_delito = function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/jyp_delito/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Delito borrado con éxito";
              var idx = -1;
              for (var i in $scope.root.delitos) {
                 if ($scope.root.delitos[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.delitos.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }
/*************************************************************************
    OPERACIONES CONJUNTAS
  *************************************************************************/

  $scope.add_op_conjunta = function() {
    $scope.root.create_op_conjunta = true;
  }

  $scope.crea_op_conjunta = function() {
    $scope.root.create_op_conjunta = false;
    //console.log($scope.root.new_op_conjunta_title);
    var json = '{ "titulo": "' + $scope.root.new_op_conjunta_title + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_op_conjunta/c", json).
     success(function(data, status, headers, config) {
      $scope.root.op_conjunta = data;
      //console.log($scope.root.op_conjunta);
      $scope.root.new_op_conjunta_title = "";
      $scope.root.op_conjuntas.push($scope.root.op_conjunta);
      $scope.root.selectedOp_conjuntaIndex = $scope.root.op_conjuntas.length -1;
      $scope.root.notification = "Nueva operación conjunta creada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al crear operación conjunta!";
    });
  }

  $scope.cancela_crea_op_conjunta = function() {
    $scope.root.create_op_conjunta = false;
    //console.log($scope.root.new_op_conjunta_title);
    $scope.root.new_op_conjunta_title = "";
  }  
  

  $scope.get_op_conjunta = function(index) {
    $scope.root.op_conjunta = $scope.root.op_conjuntas[index];
    $scope.root.selectedOp_conjuntaIndex = index;
  }

  $scope.save_op_conjunta = function() {
   if ($scope.root.op_conjunta.cedula === "undefined" || $scope.root.op_conjunta.cedula == null) {
     $scope.root.op_conjunta.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_op_conjunta/u", $scope.root.op_conjunta).
           success(function() {
            $scope.root.notification = "Información operación conjunta salvada con éxito"; 
            $scope.root.op_conjunta.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información de la operación conjunta.");
            $scope.root.error = "Error al salvar la información de la operación conjunta."; 
        });
  }

  $scope.jyp_op_conjuntas = function() {
    //console.log ("jyp_op_conjuntas selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_op_conjuntas";
    $http.get('/postulados/' + $scope.root.postulado_id + "/jyp_op_conjunta")
    .success(function(data, status, headers, config) {
      $scope.root.op_conjuntas = data;      
      $scope.root.op_conjunta = $scope.root.op_conjuntas[0];
      $scope.root.selectedOp_conjuntaIndex = 0;
      //console.log($scope.root.op_conjuntas);
      //console.log($scope.root.op_conjuntas.length);
    })
    .error(function(data, status, headers, config){
        $scope.root.error = "Error recibiendo op_conjuntas de postulado."; 
    }); 
  }


  $scope.delete_op_conjunta= function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/jyp_op_conjunta/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Operación conjunta borrada con éxito";
              var idx = -1;
              for (var i in $scope.root.op_conjuntas) {
                 if ($scope.root.op_conjuntas[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.op_conjuntas.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }


/*************************************************************************
    RELACIONES AUTORIDADES
  *************************************************************************/

  $scope.add_relaut = function() {
    $scope.root.create_relaut = true;
  }

  $scope.crea_relaut = function() {
    $scope.root.create_relaut = false;
    //console.log($scope.root.new_relaut_title);
    var json = '{ "titulo": "' + $scope.root.new_relaut_title + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_relaut/c", json).
     success(function(data, status, headers, config) {
      $scope.root.relaut = data;
      //console.log($scope.root.relaut);
      $scope.root.new_relaut_title = "";
      $scope.root.relauts.push($scope.root.relaut);
      $scope.root.selectedRelautIndex = $scope.root.relauts.length -1;
      $scope.root.notification = "Nueva relación autoridades creada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error creando nueva relación autoridades.";
    });
  }

  $scope.cancela_crea_relaut = function() {
    $scope.root.create_relaut = false;
    //console.log($scope.root.new_relaut_title);
    $scope.root.new_relaut_title = "";
  }  
  

  $scope.get_relaut = function(index) {
    $scope.root.relaut = $scope.root.relauts[index];
    $scope.root.selectedRelautIndex = index;
  }

  $scope.save_relaut = function() {
   if ($scope.root.relaut.cedula === "undefined" || $scope.root.relaut.cedula == null) {
     $scope.root.relaut.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_relaut/u", $scope.root.relaut).
           success(function() {
            $scope.root.notification = "Información relación autoridades salvada con éxito"; 
            $scope.root.relaut.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información de la relaut.");
            $scope.root.error = "Error al salvar la información de la relación autoridades."; 
        });
  }

  $scope.jyp_relauts = function() {
    //console.log ("jyp_relauts selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_relauts";
    $http.get('/postulados/' + $scope.root.postulado_id + "/jyp_relaut")
    .success(function(data, status, headers, config) {
      $scope.root.relauts = data;      
      $scope.root.relaut = $scope.root.relauts[0];
      $scope.root.selectedRelautIndex = 0;
      //console.log($scope.root.relauts);
      //console.log($scope.root.relauts.length);
    })
    .error(function(data, status, headers, config){
        $scope.root.error = "Error recibiendo información de relaciones autoridades de postulado."; 
    }); 
  }



  $scope.delete_relaut = function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/jyp_relaut/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Relación Autoridades borrada con éxito";
              var idx = -1;
              for (var i in $scope.root.relauts) {
                 if ($scope.root.relauts[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.relauts.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }


/*************************************************************************
    PARAPOLITICA
  *************************************************************************/

  $scope.add_parapolitica = function() {
    $scope.root.create_parapolitica = true;
  }

  $scope.crea_parapolitica = function() {
    $scope.root.create_parapolitica = false;
    //console.log($scope.root.new_parapolitica_title);
    var json = '{ "titulo": "' + $scope.root.new_parapolitica_title + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_parapolitica/c", json).
     success(function(data, status, headers, config) {
      $scope.root.parapolitica = data;
      //console.log($scope.root.parapolitica);
      $scope.root.new_parapolitica_title = "";
      $scope.root.parapoliticas.push($scope.root.parapolitica);
      $scope.root.selectedparapoliticaIndex = $scope.root.parapoliticas.length -1;
      $scope.root.notification = "Información parapolitica para postulado creada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al crear elemento de parapolitica para postulado.";
    });
  }

  $scope.cancela_crea_parapolitica = function() {
    $scope.root.create_parapolitica = false;
    //console.log($scope.root.new_parapolitica_title);
    $scope.root.new_parapolitica_title = "";
  }  
  

  $scope.get_parapolitica = function(index) {
    $scope.root.parapolitica = $scope.root.parapoliticas[index];
    $scope.root.selectedParapoliticaIndex = index;
  }

  $scope.save_parapolitica = function() {
   if ($scope.root.parapolitica.cedula === "undefined" || $scope.root.parapolitica.cedula == null) {
     $scope.root.parapolitica.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_parapolitica/u", $scope.root.parapolitica).
           success(function() {
            $scope.root.notification = "Información parapolitica salvada con éxito"; 
            $scope.root.parapolitica.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información de la parapolitica.");
            $scope.root.error = "Error al salvar la información de la parapolitica."; 
        });
  }

  $scope.jyp_parapoliticas = function() {
    //console.log ("jyp_parapoliticas selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_parapoliticas";
    $http.get('/postulados/' + $scope.root.postulado_id + "/jyp_parapolitica")
    .success(function(data, status, headers, config) {
      $scope.root.parapoliticas = data;      
      $scope.root.parapolitica = $scope.root.parapoliticas[0];
      $scope.root.selectedParapoliticaIndex = 0;
      //console.log($scope.root.parapoliticas);
      //console.log($scope.root.parapoliticas.length);
    })
    .error(function(data, status, headers, config){
        $scope.root.error = "Error recibiendo parapoliticas de postulado."; 
    }); 
  }

  $scope.delete_pp = function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/jyp_parapolitica/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Parapolitica borrada con éxito";
              var idx = -1;
              for (var i in $scope.root.parapoliticas) {
                 if ($scope.root.parapoliticas[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.parapoliticas.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }


  /*************************************************************************
    FOSAS
  *************************************************************************/

  $scope.add_fosa = function() {
    $scope.root.create_fosa = true;
  }

  $scope.crea_fosa = function() {
    $scope.root.create_fosa = false;
    //console.log($scope.root.newfosatitle);
    var json = '{ "titulo": "' + $scope.root.newfosatitle + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_fosa/c", json).
     success(function(data, status, headers, config) {
      $scope.root.fosa = data;
      //console.log($scope.root.fosa);
      $scope.root.newfosatitle = "";
      $scope.root.fosas.push($scope.root.fosa);
      $scope.root.selectedFosaIndex = $scope.root.fosas.length -1;
      $scope.root.notification = "Información fosa salvada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al salvar información fosa.";
    });
  }

  $scope.cancela_crea_fosa = function() {
    $scope.root.create_fosa = false;
    //console.log($scope.root.newfosatitle);
    $scope.root.newfosatitle = "";
  }  
  

  $scope.get_fosa = function(index) {
    $scope.root.fosa = $scope.root.fosas[index];
    $scope.root.selectedFosaIndex = index;
  }

  $scope.save_fosa = function() {
   if ($scope.root.fosa.cedula === "undefined" || $scope.root.fosa.cedula == null) {
     $scope.root.fosa.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/jyp_fosa/u", $scope.root.fosa).
           success(function() {
            $scope.root.notification = "Información fosa salvada con éxito"; 
            $scope.root.fosa.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información de la fosa.");
            $scope.root.error = "Error al salvar la información de la fosa."; 
        });
  }

  $scope.jyp_fosas = function() {
    //console.log ("jyp_fosas selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_fosas";
    $http.get('/postulados/' + $scope.root.postulado_id + "/jyp_fosas")
    .success(function(data, status, headers, config) {
      $scope.root.fosas = data;      
      $scope.root.fosa = $scope.root.fosas[0];
      $scope.root.selectedFosaIndex = 0;
      $scope.prepare_fosa_delitos_select();
      //console.log($scope.root.fosas);
      //console.log($scope.root.fosas.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error recibiendo información fosas de postulado."; 
    }); 
  }

  $scope.prepare_fosa_delitos_select = function() {
    if ($scope.root.delitos) {
        $scope.create_fosa_delitos_select($scope.root.delitos);
    } else {
        $http.get('/postulados/' + $scope.root.postulado_id + "/jyp_delitos")
          .success(function(data, status, headers, config) {
          $scope.create_fosa_delitos_select(data);
        })
        .error(function(data, status, headers, config){
            //console.log("Error recibiendo los delitos de postulado, para fosas."); 
            $scope.delitos_postulado = [];
        });
      }
  }

  $scope.create_fosa_delitos_select = function(delitos) {
    $scope.root.delitos_postulado = [];
    for (d in delitos) {
      var entry = {};
      entry.nombre = delitos[d].titulo;
      $scope.root.delitos_postulado.push(entry);
    }

  }


  $scope.delete_fosa = function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/jyp_fosa/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Fosa borrada con éxito";
              var idx = -1;
              for (var i in $scope.root.fosas) {
                 if ($scope.root.fosas[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.fosas.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }

  /*************************************************************************
    MENORES
  *************************************************************************/

  $scope.add_menor = function() {
    $scope.root.create_menor = true;
  }

  $scope.crea_menor = function() {
    $scope.root.create_menor = false;
    //console.log($scope.root.new_menor_title);
    var json = '{ "nombres": "' + $scope.root.new_menor_title + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/menores/c", json).
     success(function(data, status, headers, config) {
      $scope.root.menor = data;
      //console.log($scope.root.menor);
      $scope.root.new_menor_title = "";
      $scope.root.menores.push($scope.root.menor);
      $scope.root.selectedMenorIndex = $scope.root.menores.length -1;
      $scope.root.notification = "Información de menor para postulado salvada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al salvar información de menor para postulado.";
    });
  }

  $scope.cancela_crea_menor = function() {
    $scope.root.create_menor = false;
    //console.log($scope.root.new_menor_title);
    $scope.root.new_menor_title = "";
  }  
  

  $scope.get_menor = function(index) {
    $scope.root.menor = $scope.root.menores[index];
    $scope.root.selectedMenorIndex = index;
  }

  $scope.save_menor = function() {
   if ($scope.root.menor.cedula === "undefined" || $scope.root.menor.cedula == null) {
     $scope.root.menor.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/menores/u", $scope.root.menor).
           success(function() {
            $scope.root.notification = "Información de menor salvada con éxito"; 
            $scope.root.menor.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información del menor.");
            $scope.root.error = "Error al salvar la información del menor."; 
        });
  }

  $scope.menores = function() {
    //console.log ("menores selected");
    $scope.maintab.active = "menores";
    $http.get('/postulados/' + $scope.root.postulado_id + "/menores")
    .success(function(data, status, headers, config) {
      $scope.root.menores = data;      
      $scope.root.menor = $scope.root.menores[0];
      $scope.root.selectedMenorIndex = 0;
      //console.log($scope.root.menores);
      //console.log($scope.root.menores.length);
    })
    .error(function(data, status, headers, config){
        $scope.root.error = "Error recibiendo información de menores de postulado."; 
    }); 
  }

  $scope.delete_menor = function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/menores/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Menor borrado con éxito";
              var idx = -1;
              for (var i in $scope.root.menores) {
                 if ($scope.root.menores[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.menores.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }


/*************************************************************************
    PROCESOS
  *************************************************************************/

  $scope.add_proc = function() {
    $scope.root.create_proc = true;
  }

  $scope.crea_proc = function() {
    $scope.root.create_proc = false;
    //console.log($scope.root.new_proc_title);
    var json = '{ "titulo": "' + $scope.root.new_proc_title + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/proces/c", json).
     success(function(data, status, headers, config) {
      $scope.root.proc = data;
      //console.log($scope.root.proc);
      $scope.root.new_proc_title = "";
      $scope.root.proces.push($scope.root.proc);
      $scope.root.selectedProcIndex = $scope.root.proces.length -1;
      $scope.root.notification = "Información proceso para postulado creada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al crear proceso para postulado.";
    });
  }

  $scope.cancela_crea_proc = function() {
    $scope.root.create_proc = false;
    //console.log($scope.root.new_proc_title);
    $scope.root.new_proc_title = "";
  }  
  

  $scope.get_proc = function(index) {
    $scope.root.proc = $scope.root.proces[index];
    $scope.root.selectedProcIndex = index;
  }

  $scope.save_proc = function() {
   if ($scope.root.proc.cedula === "undefined" || $scope.root.proc.cedula == null) {
     $scope.root.proc.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/proces/u", $scope.root.proc).
           success(function() {
            $scope.root.notification = "Información proceso salvada con éxito"; 
            $scope.root.proc.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información del proceso.");
            $scope.root.error = "Error al salvar la información del proceso."; 
        });
  }

  $scope.proces = function() {
    $scope.maintab.active = "proc";
    $http.get('/postulados/' + $scope.root.postulado_id + "/proces")
    .success(function(data, status, headers, config) {
      $scope.root.proces = data;
      $scope.root.proc = $scope.root.proces[0];
      $scope.root.selectedProcIndex = 0;
      //console.log($scope.root.proces);
      //console.log($scope.root.proces.length);
    })
    .error(function(data, status, headers, config){
      $scope.root.error = "Error al descargar información de procesos de postulado.!";
    });
  }


  $scope.delete_proces = function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/proces/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Proceso borrado con éxito";
              var idx = -1;
              for (var i in $scope.root.proces) {
                 if ($scope.root.proces[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.proces.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }

 /*************************************************************************
    BIENES
  *************************************************************************/

  $scope.add_bien = function() {
    $scope.root.create_bien = true;
  }

  $scope.crea_bien = function() {
    $scope.root.create_bien = false;
    //console.log($scope.root.new_bien_title);
    var json = '{ "titulo": "' + $scope.root.new_bien_title + '"}';    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/bienes/c", json).
     success(function(data, status, headers, config) {
      $scope.root.bien = data;
      //console.log($scope.root.bien);
      $scope.root.new_bien_title = "";
      $scope.root.bienes.push($scope.root.bien);
      $scope.root.selectedBienIndex = $scope.root.bienes.length -1;
      $scope.root.notification = "Información de bien para postulado creada con éxito.";
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al crear información de bien para postulado.";
    });
  }

  $scope.cancela_crea_bien = function() {
    $scope.root.create_bien = false;
    //console.log($scope.root.new_bien_title);
    $scope.root.new_bien_title = "";
  }  
  

  $scope.get_bien = function(index) {
    $scope.root.bien = $scope.root.bienes[index];
    $scope.root.selectedBienIndex = index;
  }

  $scope.save_bien = function() {
   if ($scope.root.bien.cedula === "undefined" || $scope.root.bien.cedula == null) {
     $scope.root.bien.cedula = $scope.root.postulado_id;
    }    
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/bienes/u", $scope.root.bien).
           success(function() {
            $scope.root.notification = "Información del bien salvada con éxito"; 
            $scope.root.bien.dirty = false;
        }).error(function() {
            //console.log("Error al salvar la información del bien.");
            $scope.root.error = "Error al salvar la información del bien."; 
        });
  }

  $scope.bienes = function() {
    $scope.maintab.active = "bienes";
    $http.get('/postulados/' + $scope.root.postulado_id + "/bienes")
    .success(function(data, status, headers, config) {
      $scope.root.bienes = data;
      $scope.root.bien = $scope.root.bienes[0];
      $scope.root.selectedBienIndex = 0;
      //console.log($scope.root.bienes);
      //console.log($scope.root.bienes.length);
    })
    .error(function(data, status, headers, config){
      $scope.root.error = "Error al descargar información de bienes del postulado!";
    });
  }


  $scope.delete_bien= function(item) {
    var ask = confirm("Está completamente seguro de querer eliminar este elemento?");

    if (ask == true) {
          $http.delete("/admin/postulados/" + $scope.root.postulado_id + "/bienes/" + item._id)
          .success(function(data, stat, headers, conf) {
            if (stat == 204) {
              $scope.root.notification = "Bien borrado con éxito";
              var idx = -1;
              for (var i in $scope.root.bienes) {
                 if ($scope.root.bienes[i]._id == item._id) {
                     idx = i;
                     break;
                 }
              }
              if (idx > -1) {
                 $scope.root.bienes.splice(idx, 1);
              }
            }
          })
          .error(function(data, s, head, conf) {
            $scope.root.error = "Hubo error eliminando el elemento!";
          });

    } 
  }

  /*************************************************************************
    HOJA DE VIDA
  *************************************************************************/

  $scope.hv = function() {
    //console.log ("hv selected");
    $scope.root.active = "hv";
    $http.get('/postulados/' + $scope.root.postulado_id + "/hv").success(function(data, status, headers, config) {
      $scope.root.hoja = data[0];
      if (data.length == 0 ) {
        $scope.root.hoja = get_initial_hv_data();
      } else {
        delete $scope.root.hoja._id;
      }
    }).error(function(data, status, headers, config) {
      $scope.root.error = "Error al descargar información de hoja de vida del postulado!";
    });
  }

  $scope.save_hv = function() {
   if ($scope.root.hoja.cedula === "undefined" || $scope.root.hoja.cedula == null) {
     $scope.root.hoja.cedula = $scope.root.postulado_id;
    }
    //console.log($scope.root.hoja);
    $http.put('/admin/postulados/' + $scope.root.postulado_id + "/hv", $scope.root.hoja).
           success(function() {
            $scope.root.notification = "Hoja de vida salvada con éxito"; 
            $scope.root.hoja.dirty = false;
        }).error(function() {
            $scope.root.error = "Error al salvar información de hoja de vida del postulado."; 
        });
  }

  $scope.jyp = function() {
    //console.log("jyp selected");
    $scope.maintab.active = "jyp";
    $scope.jyp_delitos();
  }

});

get_initial_hv_data = function() {
  return {
    estado_civil : "No especificado",
    alias : "No especificado",
    lugar_cedula : "No especificado",
    lugar_nacimiento : "No especificado",
    frente_bec : "No especificado",
    num_desmovil : "No especificado",
//    licencia_cond : "No especificado",
//    pasaporte : "No especificado",
//    salud : "No especificado",
//    clinica : "No especificado",
    otros_nombres : "No especificado",
    estatura       : "No especificado",
    peso  : "No especificado",        
    domicilio : "No especificado",
//    residencia : "No especificado",
    fijo : "No especificado",
    celular : "No especificado",
    profesion : "No especificado",
//    militar : "No especificado",
    grado : "No especificado",
    conyugue : "No especificado",
    madre : "No especificado",
    padre : "No especificado",
    hijos : "No especificado",
    hermanos : "No especificado",
    bienes_desc: "No especificado",
//    cuentas_ahorro : "No especificado",
//   cuentas_corriente : "No especificado",
//    tarjetas_credito : "No especificado",
//    cdt : "No especificado",
//    obligaciones_entidades : "No especificado",
//    obligaciones_familiares : "No especificado",
//    seguros_vida : "No especificado",
//    inmuebles : "No especificado",
//    muebles : "No especificado",
//    sociedades : "No especificado",
//    otros : "No especificado",
//    bienes_fondo : "No especificado"
  }
}

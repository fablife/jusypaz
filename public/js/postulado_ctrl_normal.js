//app.controller("PostuladoCtrl", function PostuladoCtrl(PostuladoService, $scope, $routeParams, $http){
app.controller("PostuladoCtrl", function PostuladoCtrl($scope, $routeParams, $http){
  $scope.maintab  = {};
  $scope.subtab   = {};
  $scope.root.postulado_id    = $routeParams.postuladoId;

  $scope.maintab.active = "hv";
  $scope.subtab.active = "jyp_delitos";
  
  $scope.show_message = false;
  $scope.message_dirty = false;
  $scope.async_returns = [];
  
  $scope.root.delitos_by_codigo_penal = {};
  //console.log("postulado ctrl");
  //$scope.postulado = PostuladoService.postulado_info($scope.postulado_id );

  $scope.load_pdf_view = function() {
    var all_downloaded = true;
    if (typeof $scope.root.delitos == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/jyp_delitos')
      .success(function(data, status, headers, config) {
          $scope.root.delitos = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de delitos. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.fosas == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/jyp_fosas')
      .success(function(data, status, headers, config) {
          $scope.root.fosas = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de fosas. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.op_conjuntas == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/jyp_op_conjunta')
      .success(function(data, status, headers, config) {
          $scope.root.op_conjuntas = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de operaciones conjuntas. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.parapoliticas == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/jyp_parapolitica')
      .success(function(data, status, headers, config) {
          $scope.root.parapoliticas= data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de parapoliticas. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.relauts == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/jyp_relaut')
      .success(function(data, status, headers, config) {
          $scope.root.relauts = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de relaciones autoridades. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.menores == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/menores')
      .success(function(data, status, headers, config) {
          $scope.root.menores = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de menores. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.bienes == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/bienes')
      .success(function(data, status, headers, config) {
          $scope.root.bienes = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de bienes. Comuníquese con la administración."; 
      }); 
    }
    if (typeof $scope.root.proces == "undefined") {
      all_downloaded = false;
      $http.get('/minfo/proces')
      .success(function(data, status, headers, config) {
          $scope.root.proces = data;      
          $scope.check_download_complete();
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de procesos. Comuníquese con la administración."; 
      }); 
    }

    if (all_downloaded) {
      window.location.href = "/inicio#/pdf_view";
    }
  }

  $scope.check_download_complete = function() {
    $scope.async_returns.push(1);
    if ($scope.async_returns.length == 8) { 
      window.location.href = "/inicio#/pdf_view";
    }
  }

  /*
  * STATS
  */
  $scope.stats = function() {
    if (typeof $scope.root.delitos == "undefined") {
      $http.get('/minfo/jyp_delitos')
      .success(function(data, status, headers, config) {
        if (data.length > 0) {
          $scope.root.delitos = data;      
          $scope.root.delito = $scope.root.delitos[0];
          $scope.root.selectedDelitoIndex = 0;
          console.log($scope.root.delitos);
          console.log($scope.root.delitos.length);
          $scope.calc_stats();
        } else {
          $scope.root.delitos = [];
        }
      })
      .error(function(data, status, headers, config){
          $scope.root.error = "No se pudo bajar la lista de delitos. Comuníquese con la administración."; 
      }); 
    } else {
      $scope.calc_stats();
    }
  }

  $scope.calc_stats = function() {

    for (var i=0; i< $scope.root.delitos.length; i++) {
      var d = $scope.root.delitos[i];
      if (!$scope.root.delitos_by_codigo_penal[d.codigo_penal]) {
        $scope.root.delitos_by_codigo_penal[d.codigo_penal] = [];
      }
      $scope.root.delitos_by_codigo_penal[d.codigo_penal].push(d);
    }
    $scope.get_chart();
  }

  $scope.get_total = function(codigo) {
    return $scope.root.delitos_by_codigo_penal[codigo].length; 
  }

  $scope.get_percentage = function(codigo) {
    if ($scope.root.delitos.length > 0) {
      return Math.round( ($scope.root.delitos_by_codigo_penal[codigo].length * 100) / $scope.root.delitos.length  * 100 ) / 100;
    }
  }
  
  $scope.get_chart = function() {
   
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
 
    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
 
    var y = d3.scale.linear()
      .range([height, 0]);
 
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
 
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(1, "");
 
    var svg = d3.select("#diagram_wrapper").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
    $scope.get_diagram_data( function(data) {
      x.domain(data.map(function(d) { return d.codigo; }));
      y.domain([0, d3.max(data, function(d) { return d.amount; })]);
 
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
 
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cantidad");
 
     svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.codigo); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.amount); })
        .attr("height", function(d) { return height - y(d.amount); });
 
    });

    /*
    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }
    */
  }

  $scope.get_diagram_data = function(callback) {
    var arr = [];
    for (var c in $scope.root.delitos_by_codigo_penal) {
      var json = {}
      json.codigo = c;
      json.amount = $scope.root.delitos_by_codigo_penal[c].length;
      arr.push(json);
    }
    callback(arr);
  }
 /*
  * END STATS
  */
  $http.get('/minfo/')
        .success(function(postulado, status, headers, config) {
            console.log(postulado[0]);
            $scope.root.postulado = postulado[0];            
        })
        .error(function(data, status, headers, config){
          console.log("Error al acceder a info de hv");
        
        });

  $scope.calc_age = function(dateString) {
    var birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }


  $scope.doPrint = function() {
    window.print();
  }

  $scope.message = function() {
    $scope.show_message = true;
  }

  $scope.set_message_dirty = function() {
    $scope.message_dirty = true;
  }

  $scope.close_message = function() {
    if ($scope.message_dirty) {
      $scope.root.hoja.mensaje = null;
    }
    $scope.show_message = false;
 }
  $scope.del_message = function(type) {
    var yes = confirm("Está seguro de querer borrar la observación?");
     
    if (yes == true) {
      var data_object = null;
      var url = null;
    
      switch(type) {
        case "hv":   data_object = $scope.root.hoja;
                      url = "/minfo/hv/msg";
                      break;
        case "bien": data_object = $scope.root.bien;
                      url = "/minfo/bienes/" + $scope.root.bien._id + "/msg";
                      break;
        case "proc": data_object = $scope.root.proc;
                      url = "/minfo/procesos/" + $scope.root.proc._id + "/msg";
                      break;
        case "menor": data_object = $scope.root.menor;
                      url = "/minfo/menores/" + $scope.root.menor._id + "/msg";
                      break;
        case "delito": data_object = $scope.root.delito;
                      url = "/minfo/delitos/" + $scope.root.delito._id + "/msg";
                      break;
        case "fosa": data_object = $scope.root.fosa;
                      url = "/minfo/fosas/" + $scope.root.fosa._id + "/msg";
                      break;
        case "opcon": data_object = $scope.root.op_conjunta;
                      url = "/minfo/opcon/" + $scope.root.op_conjunta._id + "/msg";
                      break;
        case "pp": data_object = $scope.root.parapolitica;
                      url = "/minfo/pp/" + $scope.root.parapolitica._id + "/msg";
                      break;
        case "relaut": data_object = $scope.root.relaut;
                      url = "/minfo/relaut/" + $scope.root.relaut._id + "/msg";
                      break;
      }

      data_object.mensaje = null;
      $http.put(url, data_object)
        .success(function(data, state) {
          $scope.root.notification = "Observación salvada con éxito";
          data_object = data;
        })
        .error(function(data, state) {
          $scope.root.error = "La observación no se pudo mandar. Contáctese con la administración";
        });
      $scope.show_message = false;
    }
    $scope.message_dirty = false;
  }

  $scope.save_message = function(type) {
      var data_object = null;
      var url = null;
    
      switch(type) {
        case "hv":   data_object = $scope.root.hoja;
                      url = "/minfo/hv/msg";
                      break;
        case "bien": data_object = $scope.root.bien;
                      url = "/minfo/bienes/" + $scope.root.bien._id + "/msg";
                      break;
        case "proc": data_object = $scope.root.proc;
                      url = "/minfo/procesos/" + $scope.root.proc._id + "/msg";
                      break;
        case "menor": data_object = $scope.root.menor;
                      url = "/minfo/menores/" + $scope.root.menor._id + "/msg";
                      break;
        case "delito": data_object = $scope.root.delito;
                      url = "/minfo/delitos/" + $scope.root.delito._id + "/msg";
                      break;
        case "fosa": data_object = $scope.root.fosa;
                      url = "/minfo/fosas/" + $scope.root.fosa._id + "/msg";
                      break;
        case "opcon": data_object = $scope.root.op_conjunta;
                      url = "/minfo/opcon/" + $scope.root.op_conjunta._id + "/msg";
                      break;
        case "pp": data_object = $scope.root.parapolitica;
                      url = "/minfo/pp/" + $scope.root.parapolitica._id + "/msg";
                      break;
        case "relaut": data_object = $scope.root.relaut;
                      url = "/minfo/relaut/" + $scope.root.relaut._id + "/msg";
                      break;
      }
    $http.put(url, data_object)
      .success(function(data, state) {
        $scope.root.notification = "Observación salvada con éxito";
        data_object = data;
      })
      .error(function(data, state) {
        $scope.root.error = "La observación no se pudo mandar. Contáctese con la administración";
      });
    $scope.show_message = false;
    $scope.message_dirty = false;
  }
  /*************************************************************************
    DELITOS
  *************************************************************************/


  $scope.get_delito = function(index) {
    $scope.root.delito = $scope.root.delitos[index];
    $scope.root.selectedDelitoIndex = index;
  }


  $scope.jyp_delitos = function() {
    console.log ("jyp_delitos selected");
    if ($scope.maintab.active == "hv") {
      return;
    }
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_delitos";
    $http.get('/minfo/jyp_delitos')
    .success(function(data, status, headers, config) {
      if (data.length > 0) {
        $scope.root.delitos = data;      
        $scope.root.delito = $scope.root.delitos[0];
        $scope.root.selectedDelitoIndex = 0;
        console.log($scope.root.delitos);
        console.log($scope.root.delitos.length);
      } else {
        $scope.root.delitos = [];
      }
    })
    .error(function(data, status, headers, config){
        $scope.root.error = "Error recibiendo los delitos de postulado."; 
    }); 
  }

/*************************************************************************
    OPERACIONES CONJUNTAS
  *************************************************************************/

  $scope.get_op_conjunta = function(index) {
    $scope.root.op_conjunta = $scope.root.op_conjuntas[index];
    $scope.root.selectedOp_conjuntaIndex = index;
  }

  $scope.jyp_op_conjuntas = function() {
    console.log ("jyp_op_conjuntas selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_op_conjuntas";
    $http.get('/minfo/jyp_op_conjunta')
    .success(function(data, status, headers, config) {
      $scope.root.op_conjuntas = data;      
      $scope.root.op_conjunta = $scope.root.op_conjuntas[0];
      $scope.root.selectedOp_conjuntaIndex = 0;
      console.log($scope.root.op_conjuntas);
      console.log($scope.root.op_conjuntas.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error recibiendo op_conjuntas de postulado."; 
    }); 
  }




/*************************************************************************
    RELACIONES AUTORIDADES
  *************************************************************************/


  $scope.get_relaut = function(index) {
    $scope.root.relaut = $scope.root.relauts[index];
    $scope.root.selectedRelautIndex = index;
  }


  $scope.jyp_relauts = function() {
    console.log ("jyp_relauts selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_relauts";
    $http.get('/minfo/jyp_relaut')
    .success(function(data, status, headers, config) {
      $scope.root.relauts = data;      
      $scope.root.relaut = $scope.root.relauts[0];
      $scope.root.selectedRelautIndex = 0;
      console.log($scope.root.relauts);
      console.log($scope.root.relauts.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error recibiendo relauts de postulado."; 
    }); 
  }



/*************************************************************************
    PARAPOLITICA
  *************************************************************************/

  $scope.get_parapolitica = function(index) {
    $scope.root.parapolitica = $scope.root.parapoliticas[index];
    $scope.root.selectedParapoliticaIndex = index;
  }


  $scope.jyp_parapoliticas = function() {
    console.log ("jyp_parapoliticas selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_parapoliticas";
    $http.get('/minfo/jyp_parapolitica')
    .success(function(data, status, headers, config) {
      $scope.root.parapoliticas = data;      
      $scope.root.parapolitica = $scope.root.parapoliticas[0];
      $scope.root.selectedParapoliticaIndex = 0;
      console.log($scope.root.parapoliticas);
      console.log($scope.root.parapoliticas.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error recibiendo parapoliticas de postulado."; 
    }); 
  }


  /*************************************************************************
    FOSAS
  *************************************************************************/

  $scope.get_fosa = function(index) {
    $scope.root.fosa = $scope.root.fosas[index];
    $scope.root.selectedFosaIndex = index;
  }

  $scope.jyp_fosas = function() {
    console.log ("jyp_fosas selected");
    $scope.maintab.active = "jyp";
    $scope.subtab.active = "jyp_fosas";
    $http.get('/minfo/jyp_fosas')
    .success(function(data, status, headers, config) {
      $scope.root.fosas = data;      
      $scope.root.fosa = $scope.root.fosas[0];
      $scope.root.selectedFosaIndex = 0;
      console.log($scope.root.fosas);
      console.log($scope.root.fosas.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error recibiendo fosas de postulado."; 
    }); 
  }

  /*************************************************************************
    MENORES
  *************************************************************************/

  $scope.get_menor = function(index) {
    $scope.root.menor = $scope.root.menores[index];
    $scope.root.selectedMenorIndex = index;
  }

  $scope.menores = function() {
    console.log ("menores selected");
    $scope.maintab.active = "menores";
    $http.get('/minfo/menores')
    .success(function(data, status, headers, config) {
      $scope.root.menores = data;      
      $scope.root.menor = $scope.root.menores[0];
      $scope.root.selectedMenorIndex = 0;
      console.log($scope.root.menores);
      console.log($scope.root.menores.length);
    })
    .error(function(data, status, headers, config){
        $scope.error = "Error recibiendo menores de postulado."; 
    }); 
  }


/*************************************************************************
    PROCESOS
  *************************************************************************/
  

  $scope.get_proc = function(index) {
    $scope.root.proc = $scope.root.proces[index];
    $scope.root.selectedProcIndex = index;
  }

  $scope.proces = function() {
    $scope.maintab.active = "proc";
    $http.get('/minfo/proces')
    .success(function(data, status, headers, config) {
      $scope.root.proces = data;
      $scope.root.proc = $scope.root.proces[0];
      $scope.root.selectedProcIndex = 0;
      console.log($scope.root.proces);
      console.log($scope.root.proces.length);
    })
    .error(function(data, status, headers, config){
        
    });
  }


 /*************************************************************************
    BIENES
  *************************************************************************/

  $scope.get_bien = function(index) {
    $scope.root.bien = $scope.root.bienes[index];
    $scope.root.selectedBienIndex = index;
  }

  $scope.bienes = function() {
    $scope.maintab.active = "bienes";
    $http.get('/minfo/bienes')
    .success(function(data, status, headers, config) {
      $scope.root.bienes = data;
      $scope.root.bien = $scope.root.bienes[0];
      $scope.root.selectedBienIndex = 0;
      console.log($scope.root.bienes);
      console.log($scope.root.bienes.length);
    })
    .error(function(data, status, headers, config){
        
    });
  }


  /*************************************************************************
    HOJA DE VIDA
  *************************************************************************/

  $scope.hv = function() {
    console.log ("hv selected");
    $scope.root.active = "hv";
    $http.get('/minfo/hv').success(function(data, status, headers, config) {
      $scope.root.hoja = data[0];
      if (data.length == 0 ) {
        $scope.root.hoja = get_initial_hv_data();
      } else {
        delete $scope.root.hoja._id;
      }
    }).error(function(data, status, headers, config) {

    });
  }

  $scope.jyp = function() {
    console.log("jyp selected");
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

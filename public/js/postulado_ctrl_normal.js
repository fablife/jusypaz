//app.controller("PostuladoCtrl", function PostuladoCtrl(PostuladoService, $scope, $routeParams, $http){
app.controller("PostuladoCtrl", function PostuladoCtrl($scope, $routeParams, $http){
  $scope.root     = {};
  $scope.maintab  = {};
  $scope.subtab   = {};
  $scope.root.postulado_id    = $routeParams.postuladoId;

  $scope.root.create_delito   = false;
  $scope.root.newdelitotitle  = "";

  $scope.maintab.active = "hv";
  $scope.subtab.active = "jyp_delitos";
  
  console.log("postulado ctrl");

    //$scope.postulado = PostuladoService.postulado_info($scope.postulado_id );
  $http.get('/minfo/')
        .success(function(postulado, status, headers, config) {
            console.log(postulado[0]);
            $scope.root.postulado = postulado[0];            
        })
        .error(function(data, status, headers, config){
        
        });
  
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
        $scope.error = "Error recibiendo los delitos de postulado."; 
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

angular.module('app', [], function() {})
FileUploadCtrl.$inject = ['$scope', '$http','$timeout']
function FileUploadCtrl(scope, http, timeout) {
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
    scope.root.subirVideo = false
    scope.video = null

    scope.setFiles = function(element) {
    scope.$apply(function(scope) {
      console.log('files:', element.files);
      // Turn the FileList object into an Array
        if (element.files.length == 0) {
          scope.root.subirImagen = false;
          return;
        }
        scope.files = []
        for (var i = 0; i < element.files.length; i++) {
          scope.files.push(element.files[i])
        }
      scope.root.subirImagen = true;
      });
      //var label  = document.getElementById("uploadFileName"); 
      //label.innerHTML = document.getElementById("fileToUpload").value;
    };

    scope.upload = function(elem) {
      var upload_btn = document.getElementById(elem);
      upload_btn.click();
    }

    scope.show_buttons = function() {
        scope.root.show_buttons = true;        
    }

    scope.hide_buttons = function() {
        scope.root.show_buttons = false;        
    }

    scope.busca_video = function() {
      scope.root.subirVideo = true;
      scope.upload("videoToUpload");      
    }

    scope.upload_pic = function() {      
      scope.upload("fileToUpload");
    }

    scope.uploadImagen = function() {
        var fd = new FormData()
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i]);
        }
        fd.append("postuladoId",scope.root.postulado.cedula);
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadImgProgress, false)
        xhr.addEventListener("load", uploadImgComplete, false)
        xhr.addEventListener("error", uploadImgFailed, false)
        xhr.addEventListener("abort", uploadImgCanceled, false)
        xhr.open("POST", "/admin/postulados/" + scope.root.postulado.cedula + "/avatarupload")        
        scope.root.progressVisible = true
        scope.root.subirImagen = false;
        xhr.send(fd)
        
    }

    scope.del_video = function() {
      var yes = window.confirm("Está seguro de querer eliminar este video?");
      if (yes == true) {
        http.delete('/admin/postulados/' + scope.root.delito.cedula + "/videoupload/" + scope.root.delito._id)
          .success(function(data) {
            scope.root.notification = "Video eliminado con éxito";
            scope.root.delito = data; 
          })
          .error(function() {
            scope.root.error = "Error eliminando video";
          });
      }
    }

    scope.ver_video = function() {
      if (scope.video === null) {
        scope.video   = document.createElement('video');
        scope.video.controls = "controls";
        var source  = document.createElement('source');        
        source.src  = "/videos/" + scope.root.delito.cedula + "/" + scope.root.delito._id + "/" + scope.root.delito.video_path;
        if (scope.root.delito.hora_mencion) {
          scope.video.addEventListener('loadedmetadata', function() {            
            var stringtime = scope.root.delito.hora_mencion;
            var h = stringtime.substring(0,2);
            var m = stringtime.substring(3,5);
            var s = stringtime.substring(6);
            this.currentTime = parseInt(h)*3600 + parseInt(m)*60 + parseInt(s);
          }, false);          
        }
        source.type = "video/mp4";

        scope.video.appendChild(source);
        document.getElementById("video_container").appendChild(scope.video);
      }
      scope.root.play_video = true;
    }

    scope.cerrar = function() {
      scope.root.play_video = false;
      console.log(scope.root.play_video);
    }

    scope.uploadFile = function() {
        scope.root.progressVisible = true; 
        var fd = new FormData()
        for (var i in scope.files) {
            fd.append("uploadedFile", scope.files[i])
        }
        fd.append("postuladoId",scope.root.delito.cedula);
        fd.append("delitoId",scope.root.delito._id);
        var xhr = new XMLHttpRequest()
        xhr.upload.addEventListener("progress", uploadProgress, false)
        xhr.addEventListener("load", uploadComplete, false)
        xhr.addEventListener("error", uploadFailed, false)
        xhr.addEventListener("abort", uploadCanceled, false)
        xhr.open("POST", "/admin/postulados/" + scope.root.delito.cedula + "/videoupload")
        scope.root.progressVisible = true
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
        scope.root.delito = JSON.parse(evt.target.response);   
        scope.root.progressVisible = false;
        scope.root.subirVideo = false;
        alert("Video subido con exito")
    }

    function uploadFailed(evt) {
        scope.root.progressVisible = false;
        alert("Hubo un error al subir el archivo.")
    }

    function uploadCanceled(evt) {
        scope.$apply(function(){
            scope.root.progressVisible = false
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
        //scope.root.postulado = evt.target.response;
        scope.root.postulado = JSON.parse(evt.target.response);
        scope.root.subirImagen = false;
        alert("Imagen subida con exito")
    }

    function uploadImgFailed(evt) {
        scope.root.subirImagen = false;
        alert("Hubo un error al subir el archivo.")
    }

    function uploadImgCanceled(evt) {
        scope.root.subirImagen = false;
        scope.$apply(function(){
            scope.root.progressVisible = false
        })
        alert("El usuario canceló subir el archivo o el browser cortó la conexión.")
    }
}


app.directive('fileUpload', function() {
   return {
      restrict: 'E',
      scope: {
         path: "=path",
         path_id: "=pathId",
         post: "=postId",
         complete_function: "&completeFunction"
      },
      template: '<div class="uploadContainer"><input type="file" id="file_upload" class="custom-uploader-input"/><button class="buttons mleft10" ng-click="browse()" ng-show="notReady">Busca archivo</button><button class="buttons" ng-click="upload()" ng-disabled="notReady">Subir</button></div>',
      controller: function($scope, UploadService) {
        $scope.notReady = true;
        $scope.progressVisible = false;

        var uploadService = new UploadService($scope);

        uploadService.onUploadProgress(function(event){
            //Update scope here.
            if (event.lengthComputable) {
              $scope.uploadProgress = event.loaded / event.total;
            }
        });

        uploadService.onUploadComplete(function(event) {
          $scope.notReady = true;
          //$scope.root.notification = "Archivo subido con éxito.";
          alert("Archivo subido con éxito");
          console.log("upload successfully completed");
          $scope.complete_function({url: event.target.response});
        });

        uploadService.onUploadFailed(function(event) {
          $scope.notReady = true;
          alert("Hubo un error al subir el archivo! Archivo no subido.");
          console.log("Upload failed");
        });

        uploadService.onUploadCanceled(function(event) {
          $scope.notReady = true;
          alert("Upload cancelado.");
          console.log("Upload canceled");
        });

        $scope.upload = function() {
             //scope.files is set in the linking function below.
             console.log("Starting file upload at directive");
             options = {}
             options.path     = $scope.path;
             options.path_id  = $scope.path_id;
             options.post     = $scope.post;
             uploadService.beginUpload($scope.files, options);
             $scope.progressVisible = true;
         };

         $scope.browse = function() {
            var upload_btn = document.getElementById("file_upload");
            upload_btn.click();
         } 
      },
      link: function(scope, elem, attrs) {
         fileInput = elem.find('input');
         fileInput.bind('change', function(e) {
               console.log("file input changed");
               scope.notReady = e.target.files.length < 1;
               scope.files = [];
               for(var i = 0; i < e.target.files.length; i++) {
                   //set files in the scope
                   var file = e.target.files[i];
                   //scope.files.push({ name: file.name, type: file.type, size: file.size });
                   scope.files.push(file);
               }
         });
      }
   };
});

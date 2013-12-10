
app.directive('fileUpload', function() {
   return {
      restrict: 'E',
      scope: {
         path: "=path",
         path_id: "=pathId",
         post: "=postId"
      },
      template: '<div class="custom-uploader-container">Drop Files Here<input type="file" class="custom-uploader-input"/><button ng-click="upload()" ng-disabled="notReady">Subir</button></div>',
      controller: function($scope, UploadService) {
         $scope.notReady = true;
         $scope.upload = function() {
             //scope.files is set in the linking function below.
             console.log("Starting file upload at directive");
             options = {}
             options.path = $scope.path;
             options.path_id = $scope.path_id;
             options.post = $scope.post;
             UploadService.beginUpload($scope.files, options);
             $scope.progressVisible = true;
         };         
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
                   scope.files.push({ name: file.name, type: file.type, size: file.size });
                   scope.files.push(file);
               }
         });
      }
   };
});

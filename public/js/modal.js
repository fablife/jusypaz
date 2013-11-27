var ModalCtrl = function ($scope, $modal, $log) {

  $scope.open = function () {

    var modalInstance = $modal.open({
      //templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        /*items: function () {
          return $scope.items;
        }
        */
      }
    });

    modalInstance.result.then(function () {
      //$scope.selected = selectedItem;
    }, function () {
      
    });
  };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
  /*
  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };
  */
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
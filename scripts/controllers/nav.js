'use strict';

app.controller('NavCtrl', function ($scope, $location, Training, Auth) {
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.training = {name:'', id:'', pageURL: 'http://'};

  $scope.submitTraining = function () {
    $scope.training.creator = $scope.user.profile.username;
    $scope.training.creatorUID = $scope.user.uid;
    Training.create($scope.training).then(function (ref) {
      $location.path('/trainings/' + ref.name());
      $scope.training = {name:'', id:'', pageURL: 'http://'};
    });
  };

});
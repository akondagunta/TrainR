'use strict';

app.controller('TrainingsCtrl', function ($scope, $location, Training, Auth) {
  $scope.trainings = Training.all;
  $scope.user = Auth.user;

  $scope.training = {name:'', id:'', pageURL: 'http://'};

  $scope.deleteTraining = function (training) {
    Training.delete(training);
  };

});
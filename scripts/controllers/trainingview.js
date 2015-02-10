'use strict';

app.controller('TrainingViewCtrl', function ($scope, $firebase, $routeParams, Training, Auth) {
  $scope.training = Training.get($routeParams.trainingId);

  $scope.steps = Training.steps($routeParams.trainingId);
  $scope.selected = null;

  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;

  $scope.deleteStep = function (step) {
    $scope.steps.$remove(step);
  };

  $scope.editStep = function (step) {
      step.editing = true;
  }

  $scope.doneEditing = function (step) {
      step.editing = false;
      $scope.steps.$save(step);
  };

  $scope.addStep = function () {
    if(!$scope.stepContent || $scope.stepContent === '') {
      $scope.error = "Step content cannot be blank.";
      return;
    }

    if(!$scope.stepPage || $scope.stepPage === '') {
      $scope.error = "Step page cannot be blank.";
      return;
    }

    var step = {
      content: $scope.stepContent,
      element: $scope.stepElement,
      page: $scope.stepPage,
      creator: $scope.user.profile.username,
      creatorUID: $scope.user.uid,
      editing: false
    };

    $scope.steps.$add(step);

    $scope.stepEditing = false;
    $scope.stepContent = '';
    $scope.stepElement = '';
    $scope.stepPage = '';

  };

});
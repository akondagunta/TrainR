'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, user) {
    if (Auth.signedIn()) {
      $location.path('/');
    }

  $scope.login = function () {
    Auth.login($scope.user).then(function () {
      $location.path('/');
    }, function (error) {
      $scope.error = "The specified user does not exist.";
    });
  };

  $scope.register = function () {
    Auth.register($scope.user).then(function(user) {
      return Auth.login($scope.user).then(function() {
        user.username = $scope.user.username;
        return Auth.createProfile(user);
      }).then(function() {
        $location.path('/');
      });
    }, function(error) {
      $scope.error = "This username is already taken. Please use a different username.";
    });
  };

});
'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, user) {
    if (Auth.signedIn()) {
      $location.path('/');
    }

  //Next two functions are used in the view; the login button is disabled if they return false.

  //check if there is a valid email
  $scope.checkIfEmail = function(){
    //there will only be a $scope.user.email variable if it is a valid email, because the input type is email
    if ($scope.user.email) {
      return true;
    } else {
      return false;
    };
  }; 

  //check if the user has entered a password
  $scope.checkIfPwd = function(){
    if ($scope.user.password===""){
      return false;
      }else{
      return true;
    };
  };

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
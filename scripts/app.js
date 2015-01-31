'use strict';

/**
 * @ngdoc overview
 * @name inCloudTrnApp
 * @description
 * # inCloudTrnApp
 *
 * Main module of the application.
 */

var app = angular
  .module('inCloudTrnApp', [
    'ngResource',
    'ngRoute',
    'firebase',
    'dndLists'
  ])
  .config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/trainings.html',
      controller: 'TrainingsCtrl'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthCtrl',
      resolve: {
        user: function(Auth) {
          return Auth.resolveUser();
        }
      }
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthCtrl',
      resolve: {
        user: function(Auth) {
          return Auth.resolveUser();
        }
      }
    })
    .when('/trainings/:trainingId', {
      templateUrl: 'views/showtraining.html',
      controller: 'TrainingViewCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
  });

app.constant('FIREBASE_URL', 'https://incloudtrn.firebaseio.com/');


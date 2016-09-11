// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('eRolodex', ['ionic', 'starter.controllers', 'starter.services',
              'ngCordova'])

.run(function($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    setTimeout(function() {
      $cordovaSplashscreen.hide();
    }, 1000);
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    data: {
      isValidLogin : true
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    //abstract: true,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',
        resolve: {
          dashInfo : ['dashFactory', function(dashFactory){
            return dashFactory.getProfileResource(0, 0).getProfiles()
            .$promise.then(function(response) {
                dashFactory.setProfileInfo(response);
                return response;
            });
          }]
        }
      }
    }
  })

  .state('tab.images', {
    url: '/images',
    views: {
      'tab-images': {
        templateUrl: 'templates/images.html',
        controller: 'ImageCtrl',
      }
    }
  })

  .state('tab.dir', {
      url: '/dir',
      views: {
        'tab-dir': {
          templateUrl: 'templates/tab-dir.html',
          controller: 'DirCtrl',
          resolve: {
            directory: ['directoryFactory', function(directoryFactory){
              return directoryFactory.query();
            }]
          }
        }
      }
    })



    .state('tab.info', {
      url: '/info',
      views: {
        'tab-info': {
          templateUrl: 'templates/tab-info.html',
          controller: 'InfoCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

});

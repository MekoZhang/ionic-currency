// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ui.router', 'starter.controllers', 'starter.services', 'starter.directives'])

    .run(function ($ionicPlatform) {

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            //判断网络状态
            document.addEventListener("deviceready", function () {

                // listen for Online event
                $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                    console.log("device online...");
                });

                // listen for Offline event
                $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
                    //提醒用户的网络异常
                    $ionicLoading.show({
                        template: '网络异常，不能连接到服务器！'
                    });
                });
            }, false);
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('main', {
                url: "/main",
                cache: false,
                templateUrl: "templates/main.html",
                controller: "MainCtrl"
            })
            .state('swap', {
                url: "/swap",
                params: {index: 0},
                cache: false,
                templateUrl: "templates/swap.html",
                controller: "SwapCtrl"
            })
            .state('search', {
                url: "/search",
                params: {index: 0},
                cache: false,
                templateUrl: "templates/search.html",
                controller: "SearchCtrl"
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/main');

    })
;

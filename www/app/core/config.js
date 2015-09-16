(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);
    core.config(logExceptionConfig);

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };
    core.value('config', config);

    core.run(onRun);

    /* @ngInject */
    function onRun($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    }


    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    /* @ngInject */
    function logExceptionConfig($logProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }


    function routeConfig($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
      //disable view cache
      //$ionicConfigProvider.views.maxCache(0);
      
      var leftSideMenuState = {
          url: "/node",
          abstract:true,
          templateUrl: "templates/leftSideMenu.html",
          controller: "AppController",
          onEnter: function(){
            console.log("enter leftSideMenu");
          } 
      };

      var nodeListState = {
        url: "/list", //-> /node/list
        parent: leftSideMenuState,  //mandatory
        views: {
          'menuContent' :{
            templateUrl: "templates/nodeList.html",
            controller: "NodeListController"
          }
        },
        onEnter: function(){
          console.log("enter leftSideMenu.nodeList");
        }
      };

      $stateProvider
        .state('leftSideMenu', leftSideMenuState)
        .state('leftSideMenu.nodeList', nodeListState)
        /*.state('leftSideMenu.nodeSearch', {
          url: "/search",
          views: {
            'menuContent' :{
              templateUrl: "templates/nodeSearch.html",
              controller: "NodeSearchCtrl"
            }
          },
          onEnter: function(){
            console.log("enter leftSideMenu.nodeSearch");
          }
        })*/
      ;
      $urlRouterProvider.otherwise("/node/list");
    }

})();

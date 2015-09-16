"use strict";

angular.module('nodeEdit', ['ionic', 'nodeEdit.controllers'/*, 'node.services'*/])
.run(function($ionicPlatform) {
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
})
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
})

;
(function() {
  "use strict";

  angular.module('app')
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //disable view cache
    //$ionicConfigProvider.views.maxCache(0);
    
    var leftSideMenuState = {
        url: "/node",
        abstract:true,
        templateUrl: "templates/leftSideMenu.html",
        controller: "LeftSideMenuController",
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
})();
(function() {
    "use strict";

    angular.module('app')
        .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            //disable view cache
            //$ionicConfigProvider.views.maxCache(0);

            var nodeListMenuState = {
                url: "/node",
                abstract: true,
                templateUrl: "app/node/list/menu.html",
                controller: "NodeListMenuController as nodeListMenuController",
                onEnter: function() {
                    console.log("enter nodeListMenu");
                }
            };

            var nodeListState = {
                url: "/list", //-> /node/list
                parent: nodeListMenuState, //mandatory
                views: {
                    'menuContent': {
                        templateUrl: "app/node/list/list.html",
                        controller: "NodeListController as nodeListController"
                    }
                },
                onEnter: function() {
                    console.log("enter nodeListMenu.nodeList");
                }
            };

            /*var nodeSearchState = {
                url: "/search", //-> /node/list
                parent: rightSideMenuState, //mandatory
                views: {
                    'menuContent': {
                        templateUrl: "app/node/list/list.html",
                        controller: "NodeListController"
                    }
                },
                onEnter: function() {
                    console.log("enter leftSideMenu.nodeList");
                }
            };*/

            $stateProvider
                .state('nodeListMenu', nodeListMenuState)
                .state('nodeListMenu.nodeList', nodeListState)
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
        });
})();

(function() {
    "use strict";

    angular.module('app')
        .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            //disable view cache
            //$ionicConfigProvider.views.maxCache(0);

            var nodeListMenuState = {
                url: '/node',
                abstract: true,
                cache: false,
                templateUrl: 'app/layout/layout.html',
                controller: 'NodeListMenuController as nodeListMenuController',
                onEnter: function() {
                    console.log('enter nodeListMenu');
                }
            };

            var nodeListState = {
                url: '/list', //-> /node/list
                parent: nodeListMenuState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/list/list.html',
                        controller: 'NodeListController as nodeListController'
                    },
                    /*'headerContent': {
                        templateUrl: 'app/node/search/search.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    },*/
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
                    },
                    'rightMenuContent': {
                        templateUrl: 'app/node/search/filterOptions.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    }
                },
                onEnter: function() {
                    console.log('enter nodeListMenu.nodeList');
                }
            };

            var nodeViewState = {
                url: '/view/:nodeId', //-> /node/list
                parent: nodeListMenuState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/view/view.html',
                        controller: 'NodeViewController as nodeViewController'
                    },
                    /*'headerContent': {
                        templateUrl: 'app/node/view/header.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    },*/
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
                    },
                    'rightMenuContent': {
                        templateUrl: 'app/node/view/properties.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    }
                },
                onEnter: function() {
                    console.log('enter nodeListMenu.nodeList');
                }
            };

            /*var nodeSearchState = {
                url: '/search', //-> /node/list
                parent: rightSideMenuState, //mandatory
                views: {
                    'menuContent': {
                        templateUrl: 'app/node/list/list.html',
                        controller: 'NodeListController'
                    }
                },
                onEnter: function() {
                    console.log('enter leftSideMenu.nodeList');
                }
            };*/

            $stateProvider
                .state('node', nodeListMenuState)
                .state('node.list', nodeListState)
                .state('node.list.view', nodeViewState)
                /*.state('leftSideMenu.nodeSearch', {
                  url: '/search',
                  views: {
                    'menuContent' :{
                      templateUrl: 'templates/nodeSearch.html',
                      controller: 'NodeSearchCtrl'
                    }
                  },
                  onEnter: function(){
                    console.log('enter leftSideMenu.nodeSearch');
                  }
                })*/
            ;
            $urlRouterProvider.otherwise('/node/list');
        });
})();

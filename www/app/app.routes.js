(function() {
    "use strict";

    angular.module('app')
        .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            //disable view cache
            //$ionicConfigProvider.views.maxCache(0);

            var nodeState = {
                url: '/node',
                abstract: true,
                templateUrl: 'app/layout/layout.html',
                controller: 'NodeListMenuController as nodeListMenuController',
                onEnter: function() {
                    console.log('enter nodeListMenu');
                }
            };

            var nodeListState = {
                url: '/list', //-> /node/list
                parent: nodeState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/list/list.html',
                        controller: 'NodeListController as nodeListController'
                    },
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
                    },
                    'rightMenuContent': {
                        templateUrl: 'app/node/search/filterOptions.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    }
                },
                //TODO add the list resolver
                onEnter: function() {
                    console.log('enter nodeListMenu.nodeList');
                }
            };

            var nodeViewState = {
                url: '/view/:nodeId', //-> /node/list
                parent: nodeState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/view/view.html',
                        controller: 'NodeViewController as nodeViewController'
                    },
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
                    }
                },
                resolve:{
                    /* @ngInject */
                    node: function(NodeViewService, $stateParams, $state) {
                        return  NodeViewService.getNode($stateParams, $state);
                    }
                },
                onEnter: function() {
                    console.log('enter nodeListMenu.nodeList');
                }
            };

            var nodeEditState = {
                url: '/edit/:nodeId', //-> /node/list
                parent: nodeState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/edit/edit.html',
                        controller: 'NodeEditController as nodeEditController'
                    },
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
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
                .state('node', nodeState)
                .state('node.list', nodeListState)
                .state('node.view', nodeViewState)
                .state('node.edit', nodeEditState)
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

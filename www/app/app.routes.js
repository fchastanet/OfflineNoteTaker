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
                controller: 'LayoutController as layoutController',
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
                        controller: 'LayoutMenuController as layoutMenuController'   
                    },
                    'rightMenuContent': {
                        templateUrl: 'app/node/search/filterOptions.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    },
                },
                resolve:{
                    /* @ngInject */
                    nodeList: function(NodeListResolver, $stateParams, $state) {
                        return  NodeListResolver.getList($stateParams, $state);
                    }
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
                        controller: 'LayoutMenuController as layoutMenuController'   
                    }
                },
                resolve:{
                    /* @ngInject */
                    node: function(NodeViewService, $stateParams, $state) {
                        return  NodeViewService.getNode($stateParams, $state);
                    }
                },
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
                        controller: 'LayoutMenuController as layoutMenuController'   
                    }
                },
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

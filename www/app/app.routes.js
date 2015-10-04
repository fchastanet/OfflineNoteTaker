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
                    /*'headerContent': {
                        templateUrl: 'app/node/search/search.html',
                        controller: 'NodeSearchController as nodeSearchController'   
                    },*/
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
                    },
                    'rightHeaderContent@node': {
                        templateUrl: 'app/node/list/rightHeader.html',
                        controller: 'NodeListController as nodeListController',
                        cache: false
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
                parent: nodeState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/view/view.html',
                        controller: 'NodeViewController as nodeViewController'
                    },
                    'rightHeaderContent@node': {
                        templateUrl: 'app/node/view/rightHeader.html',
                        controller: 'NodeViewController as nodeListController',
                        cache: false
                    },
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

            var nodeEditState = {
                url: '/edit/:nodeId', //-> /node/list
                parent: nodeState, //mandatory
                views: {
                    'content': {
                        templateUrl: 'app/node/edit/edit.html',
                        controller: 'NodeEditController as nodeViewController'
                    },
                    'rightHeaderContent@node': {
                        templateUrl: 'app/node/edit/rightHeader.html',
                        controller: 'NodeEditController as nodeListController',
                        cache: false
                    },
                    'leftMenuContent': {
                        templateUrl: 'app/layout/menu.html',
                        controller: 'MenuController as menuController'   
                    },
                    'rightMenuContent': {
                        templateUrl: 'app/node/edit/properties.html',
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

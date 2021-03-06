(function() {
    'use strict';

    angular
        .module('app.node.list')
        .factory('NodeListResolver', NodeListResolver)
        .controller('NodeListController', NodeListController)
        .controller('NodeListMenuController', NodeListMenuController)
    ;

    /**
     * Node list resolver To be used as the resolver of the route node.list
     * @depends nodeService in order to retrieve the list of nodes 
     * @depends toastrWrapper display messages on the screen
     * @ngInject
     */
    function NodeListResolver(nodeService, toastrWrapper) {
                
        return {
            getList: getList
        };

        /**
         * @param $state in order change route in case of error
         * @param $stateParams stateParameters parameter containing nodeId url parameter
         */
        function getList($stateParams, $state) {
            //retrieve the node list using nodeService
            return nodeService.getNodeList()
                .then(function(nodeList) {
                    return nodeList;
                })
                .catch(function(error) {
                    //TODO I18N
                    toastrWrapper.error('error lors de l\'accès à la liste des documents', 'erreur');
                })
            ;
        }
    }

    /* @ngInject */
    function NodeListController($scope, pouchCollection, logger, toastrWrapper, nodeList, nodeService) {
        console.log('enter NodeListController');
        $scope.nodeList = nodeList;
        $scope.itemContextualMenu = [{
            text: 'Edit',
            onTap: function(item, button) {
                alert(button.text + ' Button: ' + item.title);
            }
        }, {
            text: 'Delete',
            type: 'button-balanced',
            onTap: function(item, button) {
                alert(button.text + ' Button: ' + item.title);
            }
        }];
        
        $scope.deleteNode = function(item) {

        };

        

    }

    /* @ngInject */
    function NodeListMenuController($scope, logger) {
        /*jshint validthis: true */

    }
})();

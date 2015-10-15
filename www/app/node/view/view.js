(function() {
    'use strict';

    angular
        .module('app.node.view')
        .controller('NodeViewController', NodeViewController)
        .factory('NodeViewService', NodeViewService)
    ;

    /**
     * Node resolver To be used as the resolver of the route node.view
     * @depends nodeService in order to retrieve the node specified in route param
     * @depends toastr display messages on the screen
     * @ngInject
     */
    function NodeViewService(nodeService, toastr) {
        
        /**
         * return to the node list state in case of error
         */
        function returnToList() {
            $state.transitionTo('node.list', {}, {
                reload: false,
                inherit: false,
                notify: true
            });
        }
        
        return {
            getNode: getNode
        };

        /**
         * @param $state in order change route in case of error
         * @param $stateParams stateParameters parameter containing nodeId url parameter
         */
        function getNode($stateParams, $state) {
            //get the nodeId parameter
            var nodeId = $stateParams.nodeId;
            if (!nodeId || nodeId === '') {
                //TODO I18N
                toastr.error('vous n\'avez pas spécifié d\'identifiant de document', 'erreur');
                returnToList();
                return;
            }
            //retrieve the node using nodeService
            return nodeService.getNode(nodeId)
                .then(function(doc) {
                    return doc;
                })
                .catch(function(error) {
                    //TODO I18N
                    toastr.error('error lors de l\'accès au document', 'erreur');
                    returnToList();
                })
            ;
        }
    }

    /* @ngInject */
    function NodeViewController($scope, $rootScope, pouchCollection, logger, toastr, node) {
        /*jshint validthis: true */

        //public scope methods
        $scope.duplicate = duplicate;

        $scope.node = node;

        activate();

        function duplicate() {

        }

        //private methods
        function activate() {

        }




    }
})();

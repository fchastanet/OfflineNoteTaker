(function() {
    'use strict';

    angular
        .module('app.node.edit')
        .controller('NodeEditController', NodeEditController)
    ;

    /* @ngInject */
    function NodeEditController(
        $scope, $rootScope, $state, pouchCollection, logger
    ) {
        /*jshint validthis: true */
        $scope.node =  {
        };
        $scope.viewTitle = 'New Node';

        //methods
        $scope.create = function(node) {
            pouchCollection.$add(node).then(function(err, res) {
                if (err) {
                    logger.error(err);
                } else {
                    $state.transitionTo('node.list', {}, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }
            });

        };

        $rootScope.$on(
            '$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams) { 
                if (toState.name === 'node.edit') {
                    if (toParams.nodeId === '') {
                        $scope.node = {};
                    }
                }
            }
        );
    }
})();

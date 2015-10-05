(function() {
    'use strict';

    angular
        .module('app.node.edit')
        .controller('NodeEditController', NodeEditController)
    ;

    /* @ngInject */
    function NodeEditController(
        $scope, dbService, logger
    ) {
        /*jshint validthis: true */
        $scope.node =  {
        };
        $scope.viewTitle = 'New Node';

        //methods
        $scope.create = function(node) {
            dbService.post(angular.copy(node), function(err, res) {
                if (err) {
                    logger.error(err);
                }
            });
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('app.node.edit')
        .controller('NodeEditController', NodeEditController)
    ;

    /* @ngInject */
    function NodeEditController($scope, synchronizationService, logger) {
        /*jshint validthis: true */
        $scope.node =  {
            title: 'New Node'
        };
    }
})();

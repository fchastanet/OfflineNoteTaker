(function() {
    'use strict';

    angular
        .module('app.node.view')
        .controller('NodeViewController', NodeViewController)
    ;

    /* @ngInject */
    function NodeViewController($scope, dbService, logger) {
        /*jshint validthis: true */
        $scope.node =  {
            title: 'coucou',
            content: 'coucou le monde'
        };

        $scope.duplicate = function() {

        };
    }
})();

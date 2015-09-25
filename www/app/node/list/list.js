(function() {
    'use strict';

    angular
        .module('app.node.list')
        .controller('NodeListController', NodeListController)
    ;

    /* @ngInject */
    function NodeListController($scope, synchronizationService, logger) {
        /*jshint validthis: true */
        $scope.nodeList = [
           {title: "titre 1"},
            {title: "titre 2"},
            {title: "titre 3"},
            {title: "titre 4"},
        ];
    }
})();
(function() {
    'use strict';

    angular
        .module('app.node.list')
        .controller('NodeListController', 
            [ '$scope', 'dataservice', 'logger', NodeListController ]
        )
    ;

    /* @ngInject */
    function NodeListController($scope, dataservice, logger) {
        /*jshint validthis: true */
        $scope.nodeList = [
           {title: "titre 1"},
            {title: "titre 2"},
            {title: "titre 3"},
        ];
    }
})();
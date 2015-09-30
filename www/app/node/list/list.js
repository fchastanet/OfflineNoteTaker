(function() {
    'use strict';

    angular
        .module('app.node.list')
        .controller('NodeListController', NodeListController)
        .controller('NodeListMenuController', NodeListMenuController);

    /* @ngInject */
    function NodeListController($scope, synchronizationService, logger) {
        /*jshint validthis: true */
        $scope.nodeList = [{
            title: "titre 1"
        }, {
            title: "titre 2"
        }, {
            title: "titre 3"
        }, {
            title: "titre 4"
        }, ];

        $scope.itemContextualMenu = [{
            text: 'Edit',
            onTap: function(item, button) {
                alert(button.text + ' Button: ' + item.title)
            }
        }, {
            text: 'Delete',
            type: 'button-balanced',
            onTap: function(item, button) {
                alert(button.text + ' Button: ' + item.title)
            }
        }];

        $scope.deleteNode = function(item) {

        };
    }

    /* @ngInject */
    function NodeListMenuController($scope, synchronizationService, logger) {
        /*jshint validthis: true */

    }
})();

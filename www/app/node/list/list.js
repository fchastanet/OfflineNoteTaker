(function() {
    'use strict';

    angular
        .module('app.node.list')
        .controller('NodeListController', NodeListController)
        .controller('NodeListMenuController', NodeListMenuController);

    /* @ngInject */
    function NodeListController($scope, dbService, logger) {
        console.log('enter NodeListController');
        /*jshint validthis: true */
        /*$scope.nodeList = [{
            id: 1,
            title: "titre 1"
        }, {
            id: 2,
            title: "titre 2"
        }, {
            id: 3,
            title: "titre 3"
        }, {
            id: 4,
            title: "titre 4"
        }, ];*/
        $scope.nodeList = dbService.nodeList;

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
        $scope.toggleOnline = function() {
            dbService.toggleOnline();
        };

        
        $scope.deleteNode = function(item) {

        };
    }

    /* @ngInject */
    function NodeListMenuController($scope, logger) {
        /*jshint validthis: true */

    }
})();

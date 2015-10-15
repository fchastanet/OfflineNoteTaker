(function() {
    'use strict';

    angular
        .module('app.node.list')
        .controller('NodeListController', NodeListController)
        .controller('NodeListMenuController', NodeListMenuController);

    /* @ngInject */
    function NodeListController($scope, pouchCollection, logger) {
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
        $scope.$on('$ionicView.enter', function() {
            // code to run each time view is entered
            $scope.nodeList = pouchCollection.collection;    
        });

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
            var deferred = pouchCollection.$toggleOnline()
            deferred.promise.then(
                //success
                function(data) {
                    logger.success('success promise', data);
                    $scope.online = (pouchCollection.$isOnline());
                },
                //error
                function(data) {
                    logger.error('error promise', data);
                    $scope.online = (pouchCollection.$isOnline());
                },
                //notify
                function(data) {
                    logger.warning('notify promise', data);
                    $scope.online = (pouchCollection.$isOnline());
                }
            );
        };

        
        $scope.deleteNode = function(item) {

        };
    }

    /* @ngInject */
    function NodeListMenuController($scope, logger) {
        /*jshint validthis: true */

    }
})();

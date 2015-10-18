(function() {
    'use strict';

    angular
        .module('app.node.list')
        .controller('NodeListController', NodeListController)
        .controller('NodeListMenuController', NodeListMenuController);

    /* @ngInject */
    function NodeListController($scope, pouchCollection, logger, toastrWrapper) {
        console.log('enter NodeListController');
        $scope.$on('$ionicView.enter', function() {
            // code to run each time view is entered
            $scope.nodeList = pouchCollection.collection;    
        });

        $scope.itemContextualMenu = [{
            text: 'Edit',
            onTap: function(item, button) {
                alert(button.text + ' Button: ' + item.title);
            }
        }, {
            text: 'Delete',
            type: 'button-balanced',
            onTap: function(item, button) {
                alert(button.text + ' Button: ' + item.title);
            }
        }];

        var onlineState = false;
        $scope.online = onlineState;
        $scope.toggleOnline = function() {
            var deferred = pouchCollection.toggleOnline();
            deferred.promise.then(
                //success
                function(data) {
                    logger.success('success promise', data);
                    $scope.online = (pouchCollection.isOnline());
                    changeOnlineState(toastrWrapper, $scope);
                },
                //error
                function(data) {
                    logger.error('error promise', data);
                    var online = (pouchCollection.isOnline());
                    changeOnlineState(toastrWrapper, $scope);
                },
                //notify
                function(data) {
                    logger.warning('notify promise', data);
                    changeOnlineState(toastrWrapper, $scope);
                }
            );

            function changeOnlineState(toastrWrapper, $scope) {
                var oldOnlineState = onlineState;
                onlineState  = (pouchCollection.isOnline());
                $scope.online = onlineState;
                if (oldOnlineState !== onlineState) {
                    if (onlineState) {
                        toastrWrapper.info('aplication online');
                    } else {
                        toastrWrapper.info('aplication offline');
                    }
                }
            }
        };

        
        $scope.deleteNode = function(item) {

        };
    }

    /* @ngInject */
    function NodeListMenuController($scope, logger) {
        /*jshint validthis: true */

    }
})();

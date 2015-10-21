(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('LayoutController', LayoutController)
        .controller('LayoutMenuController', LayoutMenuController)
    ;

    /* @ngInject */
    function LayoutController($rootScope, $scope, nodeService, logger, toastrWrapper) {
        /*jshint validthis: true */
        $scope.online = false;
        $scope.toggleOnline = function() {
            nodeService.toggleOnline();
        };

        /*jshint validthis: true */
        $rootScope.$on('sync.onlineState', function(event, data) {
            $scope.online = data.state;
            if (data.state) {
                toastrWrapper.info('aplication online');
            } else {
                toastrWrapper.info('aplication offline');
                $scope.syncStatus.label = 'hors ligne';
            }
        });
        $scope.syncStatus = {
            'code': null,
            'label': 'hors ligne'
        };
        $rootScope.$on('sync.syncState', function(event, data) {
            $scope.syncStatus.code = data.state;
            if (data.state === 'paused') {
                $scope.syncStatus.label = 'synchronisation en pause';
            } else {
                $scope.syncStatus.label = 'synchronisation active';
            }
        });
    }

     /* @ngInject */
    function LayoutMenuController($scope, logger) {
        /*jshint validthis: true */

    }

})();

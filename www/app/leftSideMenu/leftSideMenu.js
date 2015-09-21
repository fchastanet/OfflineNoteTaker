(function() {
    'use strict';

    angular
        .module('app.leftSideMenu')
        .controller(
            'LeftSideMenuController', 
            [$scope, dataservice, logger, LeftSideMenuController]
        )
    ;

    /* @ngInject */
    function LeftSideMenuController($scope, dataservice, logger) {
        /*jshint validthis: true */

    }
})();

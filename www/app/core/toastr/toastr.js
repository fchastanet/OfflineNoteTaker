(function() {
    'use strict';

    angular
        .module('app.core.toastr')
        .factory('toastr', toastr);

    /* @ngInject */
    function toastr($log, toastr) {
        var service = {
            error   : error,
            info    : info,
            success : success,
            warning : warning,
        };

        return service;
        /////////////////////

        function error(message, title) {
            //TODO attendre v3 qui n'a pas de dépendance avec jquery
            //toastr.error(message, title);
            $log.error('Toastr Error: ' + message, title);
        }

        function info(message, title) {
            //toastr.info(message, title);
            $log.info('Toastr Info: ' + message, title);
        }

        function success(message, title) {
            //toastr.success(message, title);
            $log.info('Toastr Success: ' + message, title);
        }

        function warning(message, title) {
            //toastr.warning(message, title);
            $log.info('Toastr Warning: ' + message, title);
        }
    }
}());

(function() {
    'use strict';

    angular
        .module('app.core.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
            //TODO attendre v3 qui n'a pas de dépendance avec jquery
            //toastr.error(message, title);
            if (typeof data === "undefined") {
                $log.error('Error: ' + message);
            } else {
                $log.error('Error: ' + message, data);
            }
        }

        function info(message, data, title) {
            //toastr.info(message, title);
            if (typeof data === "undefined") {
                $log.info('Info: ' + message);    
            } else {
                $log.info('Info: ' + message, data);
            }
            
        }

        function success(message, data, title) {
            //toastr.success(message, title);
            if (typeof data === "undefined") {
                $log.info('Success: ' + message);
            } else {
                $log.info('Success: ' + message, data);
            }
        }

        function warning(message, data, title) {
            //toastr.warning(message, title);
            if (typeof data === "undefined") {
                $log.warn('Warning: ' + message);
            } else {
                $log.warn('Warning: ' + message, data);
            }
        }
    }
}());

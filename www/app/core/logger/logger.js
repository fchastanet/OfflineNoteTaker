(function() {
    'use strict';

    angular
        .module('app.core.logger')
        .factory('logger', logger);

    /* @ngInject */
    function logger($log) {
        var service = {
            error   : error,
            info    : info,
            success : success,
            warning : warning,
            debug : debug,
        };

        return service;
        /////////////////////

        function error(message, data) {
            if (typeof data === 'undefined') {
                $log.error('Error: ' + message);
            } else {
                $log.error('Error: ' + message, data);
            }
        }

        function info(message, data) {
            if (typeof data === 'undefined') {
                $log.info('Info: ' + message);    
            } else {
                $log.info('Info: ' + message, data);
            }
            
        }

        function success(message, data) {
            if (typeof data === 'undefined') {
                $log.info('Success: ' + message);
            } else {
                $log.info('Success: ' + message, data);
            }
        }

        function warning(message, data) {
            if (typeof data === 'undefined') {
                $log.warn('Warning: ' + message);
            } else {
                $log.warn('Warning: ' + message, data);
            }
        }

        //TODO config to deactivate
        function debug(message, data) {
            if (typeof data === 'undefined') {
                $log.debug('Debug: ' + message);
            } else {
                $log.debug('Debug: ' + message, data);
            }
        }
    }
}());

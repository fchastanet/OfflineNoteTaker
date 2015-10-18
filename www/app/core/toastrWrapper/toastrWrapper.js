(function() {
    'use strict';

    angular
        .module('app.core.toastrWrapper')
        .provider('toastrWrapper', toastrWrapper);

    function toastrWrapper() {
        this.options = {};

        this.configure = function (options) {
            this.options = options;
        };

        var toastrInstance = null;
        this.toastr = function() {
            if (!toastrInstance) {
                toastrInstance = new toastr(this.options);
            }
            return toastrInstance;
        };

        /* @ngInject */
        this.$get = function (logger) {
            var service = {
                error   : error,
                info    : info,
                success : success,
                warning : warning,
                options: {}
            };    
            var that = this;
            return service;
            /////////////////////

            function error(message, title) {
                that.toastr().error(message, title);
                logger.error('Toastr Error: ' + message, title);
            }

            function info(message, title) {
                that.toastr().info(message, title);
                logger.info('Toastr Info: ' + message, title);
            }

            function success(message, title) {
                that.toastr().success(message, title);
                logger.info('Toastr Success: ' + message, title);
            }

            function warning(message, title) {
                that.toastr().warning(message, title);
                logger.info('Toastr Warning: ' + message, title);
            }
        };
    }
}());

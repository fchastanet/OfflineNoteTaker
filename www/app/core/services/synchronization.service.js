(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('synchronizationService', synchronizationService);

    /* @ngInject */
    function synchronizationService($http, $location, $q, exception, logger) {
        var isPrimed = false;
        var primePromise;

        var service = {
            synchronize: synchronize,
            ready: ready
        };

        return service;

        function synchronize() {
            //TODO
        }
        function prime() {
            // This function can only be called once.
            if (primePromise) {
                return primePromise;
            }

            primePromise = $q.when(true).then(success);
            return primePromise;

            function success() {
                isPrimed = true;
                logger.info('Primed data');
            }
        }

        function ready(nextPromises) {
            var readyPromise = primePromise || prime();

            return readyPromise
                .then(function() { return $q.all(nextPromises); })
                .catch(exception.catcher('"ready" function failed'));
        }
    }
})();

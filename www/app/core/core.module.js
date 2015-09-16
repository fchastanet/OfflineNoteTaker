(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        'core.exception', 'core.logger'
        /*
         * 3rd Party modules
         */
        
    ]);
})();

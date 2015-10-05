/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ui.router', 
        /*
         * 3rd Party modules
         */

        /*
         * Our reusable cross app code modules
         */
        'app.core.exception', 
        'app.core.logger',
        'app.core.db'
        
    ])        
    .constant('toastr', toastr)
    .constant('moment', moment);

})();

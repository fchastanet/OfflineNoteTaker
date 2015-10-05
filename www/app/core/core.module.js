/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ui.router', 
        /*
         * Our reusable cross app code modules
         */
        'app.core.exception', 
        'app.core.logger',
        'app.core.services'
        /*
         * 3rd Party modules
         */
        
    ])        
    .constant('toastr', toastr)
    .constant('moment', moment);

})();

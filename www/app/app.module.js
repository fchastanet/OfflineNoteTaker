(function() {
    'use strict';

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0',
        pouchdb: {
            dbName: 'nodes',
            collectionUrl: 'http://localhost:5984/', // The pouchDB url where the collection lives
            localDbOptions: {},
            remoteDbOptions: {},
            debug: true
        }
    };

    var app = angular.module('app', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * its components are available.
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'ionic',
        'app.core',
        //'app.widgets',

        'monospaced.elastic',

        /*
         * Feature areas
         */
        'app.node.list',
        'app.node.edit',
        'app.node.view',
        'app.node.search',
        'app.layout'
    ]);
    app.value('config', config);
    app.config(toastrConfig);
    app.config(logExceptionConfig);
    app.config(pouchCollectionConfig);

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    /* @ngInject */
    function logExceptionConfig($logProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);
    }

    /* @ngInject */
    function pouchCollectionConfig(pouchCollectionProvider) {
        pouchCollectionProvider.configure(config.pouchdb);
    }
})();

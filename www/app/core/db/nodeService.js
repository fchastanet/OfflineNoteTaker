(function() {
    'use strict';

    angular
        .module('app.core.db')
        .service('nodeService', nodeService)
    ;

    /**
     * @return {[type]}
     * @ngInject
     */
    function nodeService(pouchCollection) {
        /* jshint validthis:true */
        var service = {
            getNode: getNode
        };
        return service;
        
        //TODO cache
        function getNode(nodeId) {
            return pouchCollection.getItem(nodeId);
        }
    }

    
})();

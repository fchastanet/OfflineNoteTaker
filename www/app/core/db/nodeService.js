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
            getNode: getNode,
            getNodeList: getNodeList
        };
        return service;
        
        //TODO cache
        function getNode(nodeId) {
            return pouchCollection.getItem(nodeId);
        }
        function getNodeList() {
            return pouchCollection.collection;    
        }
    }

    
})();

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
    function nodeService($rootScope, pouchCollection, logger) {
        /* jshint validthis:true */
        var service = {
            getNode: getNode,
            getNodeList: getNodeList,
            toggleOnline: toggleOnline,
            onlineState: false
        };
    
        //private variables
        var that = this;

        return service;
        
        //TODO cache
        function getNode(nodeId) {
            return pouchCollection.getItem(nodeId);
        }
        function getNodeList() {
            return pouchCollection.getList();    
        }
        function toggleOnline() {
            var deferred = pouchCollection.toggleOnline();
            deferred.promise.then(
                //success
                function(data) {
                    logger.success('success promise', data);
                    changeOnlineState($rootScope);
                },
                //error
                function(data) {
                    logger.error('error promise', data);
                    changeOnlineState($rootScope);
                },
                //notify
                function(data) {
                    logger.warning('notify promise', data);
                    changeOnlineState($rootScope);
                    $rootScope.$emit('sync.syncState', {state: data.code});
                }
            );

            function changeOnlineState($rootScope) {
                var oldOnlineState = service.onlineState;
                service.onlineState  = (pouchCollection.isOnline());
                if (oldOnlineState !== service.onlineState) {
                    $rootScope.$emit('sync.onlineState', {state: service.onlineState});
                }
            }
        }
    }

    
})();

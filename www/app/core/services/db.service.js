(function() {
    'use strict';

    angular
        .module('app.core.services')
        .factory('dbService', dbService);

    /* @ngInject */
    function dbService($http, $location, $q, exception, logger) {
        var db = new PouchDB('nodeList');

        var dbService = {
            db: db,
            online: false,
            nodeList: [],
            toggleOnline: function() {
                this.online = !this.online;
                if (this.online) { // Read http://pouchdb.com/api.html#sync
                    this.sync = db.sync('http://127.0.0.1:5984/nodes', {
                            live: true
                        })
                        .on('error', function(err) {
                            logger.info('Syncing stopped');
                            logger.error(err);
                        });
                } else {
                    this.sync.cancel();
                }
            },
            createNode: function(node) {
                
            }
        };

        db.changes({
            live: true,
            onChange: function(change) {
                if (!change.deleted) {
                    db.get(change.id, function(err, doc) {
                        if (err) {
                            logger.error(err);
                        }
                        dbService.$apply(function() { //UPDATE
                            for (var i = 0; i < dbService.nodeList.length; i++) {
                                if (dbService.nodeList[i]._id === doc._id) {
                                    dbService.nodeList[i] = doc;
                                    return;
                                }
                            } // CREATE / READ
                            dbService.nodeList.push(doc);
                        });
                    });
                } else { //DELETE
                    dbService.$apply(function() {
                        for (var i = 0; i < dbService.nodeList.length; i++) {
                            if (dbService.nodeList[i]._id === change.id) {
                                dbService.nodeList.splice(i, 1);
                            }
                        }
                    });
                }
            }
        });
        return dbService;
    }
})();

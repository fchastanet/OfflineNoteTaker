(function() {
    'use strict';

    angular
        .module('app.core.db')
        .provider('pouchCollection', pouchCollectionProvider)
    ;

    /**
     * Must configure the exception handling
     * @return {[type]}
     */
    function pouchCollectionProvider() {
        /* jshint validthis:true */
        this.config = {
            dbName: '',
            collectionUrl: undefined,
            localDbOptions: {},
            remoteDbOptions: {},
            debug: false
        };
        this.currentDb = null;
        this.localDb = null;
        this.remoteDb = null;

        this.configure = function (config) {
            this.config.dbName = config.dbName;
            this.config.collectionUrl = config.collectionUrl;
            this.config.localDbOptions = config.localDbOptions;
            this.config.remoteDbOptions = config.remoteDbOptions;
            this.config.debug = config.debug;
        };

        /* @ngInject */        
        this.initPouchDb = function($window, pouchDB) {
            this.currentDb = this.localDb = pouchDB(this.config.dbName, this.config.options);
            this.remoteDb = pouchDB(this.config.collectionUrl+this.config.dbName, this.config.options);

            if (this.config.debug) {
                $window.PouchDB.debug.enable('*');
            }            
            console.log('localDb.adapter :'+ this.localDb.adapter);
            console.log('remoteDb.adapter :'+ this.remoteDb.adapter);
        };

        var that = this;

        /* @ngInject */
        this.$get = function ($timeout, $window, pouchDB, $q, exception, logger) {
            that.initPouchDb($window, pouchDB);
            /**
             * @class item in the collection
             * @param item
             * @param {int} index             position of the item in the collection
             *
             * @property {String} _id         unique identifier for this item within the collection
             * @property {int} $index         position of the item in the collection
             */
            function PouchDbItem(item, index) {
                this.$index = index;
                angular.extend(this, item);
            }

            /**
             * create a pouchCollection
             * from config {String} collectionUrl The pouchDB url where the collection lives
             * @return {Array}                An array that will hold the items in the collection
             */
            var pouchObject = {
                collection: [],
                indexes: {},
                db: that.db
            };

            /*
             * PUBLIC METHODS
             */
            pouchObject.$toggleOnline = toggleOnline;
            pouchObject.$isOnline = isOnline;
            pouchObject.$add = add;
            pouchObject.$remove = remove;
            pouchObject.$update = update;
            pouchObject.$getItem = getItem;

            /**
             * TODO récupérer le document entier avec toutes les dépendances
             */
            function getItem(itemId) {
                var deferred = $q.defer();

                var docIndex = getIndex(itemId);
                if (docIndex < 0) {
                    deferred.reject({errorCode:'docNotFound'});
                    return deferred;
                }

                that.currentDb.get(itemId, {include_docs: true,attachments: true}).then(function (doc) {
                    deferred.resolve(doc);  
                }).catch(function (err) {
                  deferred.reject({errorCode:'processError', error:err});
                });
                
                return deferred.promise;
            }

            function toggleOnline() {
                var deferred = $q.defer();
                if (pouchObject.collection.sync == null) { // Read http://pouchdb.com/api.html#sync
                    that.currentDb = that.remoteDb;
                    //TODO option retry: true,  implémneter le retry dans le onError
                    pouchObject.collection.sync = that.remoteDb.sync(
                        that.config.collectionUrl + that.config.dbName, 
                        {live: true}, 
                        function(error) {
                            //callback nécessaire sinon l'erreur n'est pas remontée
                        }
                    );
                    pouchObject.collection.sync
                        .then(
                            //success
                            function(info) {
                                var result = {data:info, code:'connectionSuccess', status:'running'};
                                deferred.resolve(result);
                                return result;
                            },
                            //error
                            function(error) {
                                logger.info('Syncing stopped due to an error');
                                logger.error(error);
                                deferred.reject({data:error, code:'error', status:'stopped'});
                                pouchObject.collection.sync = null;
                            },
                            //notify
                            function(notify) {

                            }
                        );
                } else {
                    //offline requested, we stops the synchronization
                    pouchObject.collection.sync.cancel();
                    pouchObject.collection.sync = null;
                    logger.info('Syncing halted by the user');
                    var result = {data:info, code:'disconnectionSuccess', status:'stopped'};
                    deferred.resolve(result);
                }
                return deferred;
            }

            function isOnline() {
                return (pouchObject.collection.sync !== null);
            }

            function add(item) {
                var deferred = $q.defer();
                try
                {
                    that.currentDb.post(angular.copy(item)).then(
                        function(res) {
                            item._rev = res.rev;
                            item._id = res.id;
                            updateCollection(item);
                            deferred.resolve();
                        }
                    );
                } catch (e) {
                    deferred.reject();
                }

                return deferred.promise;
            }
            function remove(itemOrId) {
                var item = angular.isString(itemOrId) ? pouchObject.collection[itemOrId] : itemOrId;
                that.currentDb.remove(item);
            }

            function update(itemOrId) {
                var item = angular.isString(itemOrId) ? pouchObject.collection[itemOrId] : itemOrId;
                var copy = {};
                angular.forEach(item, function(value, key) {
                    if (key.indexOf('$') !== 0) {
                        copy[key] = value;
                    }
                });
                that.currentDb.get(item._id).then(
                    function(res) {
                        that.currentDb.put(copy, res._rev);
                    }
                );
            }

            /*
             * PRIVATE METHODS
             */
            function getIndex(itemId) {
                return itemId ? pouchObject.indexes[itemId] : -1;
            }

            function addChild(index, item) {
                pouchObject.indexes[item._id] = index;
                pouchObject.collection.splice(index, 0, item);
                logger.info('added: ', index, item);
            }

            function removeChild(id) {
                var index = pouchObject.indexes[id];

                // Remove the item from the collection
                pouchObject.collection.splice(index, 1);
                pouchObject.indexes[id] = undefined;

                logger.info('removed: ', id);
            }

            function updateChild(index, item) {
                pouchObject.collection[index] = item;
                console.log('changed: ', index, item);
            }

            function moveChild(from, to, item) {
                pouchObject.collection.splice(from, 1);
                pouchObject.collection.splice(to, 0, item);
                updateIndexes(from, to);
                console.log('moved: ', from, ' -> ', to, item);
            }

            function updateIndexes(from, to) {
                var length = pouchObject.collection.length;
                to = to || length;
                if (to > length) {
                    to = length;
                }
                for (var index = from; index < to; index++) {
                    var item = pouchObject.collection[index];
                    item.$index = pouchObject.indexes[item._id] = index;
                }
            }

            function updateCollection(change)
            {
                if (typeof change.deleted === 'undefined') {
                    that.currentDb.get(change._id).then(function(data) {
                        if (typeof pouchObject.indexes[change._id] === 'undefined') { // CREATE / READ
                            addChild(pouchObject.collection.length, new PouchDbItem(data, pouchObject.collection.length)); // Add to end
                            updateIndexes(0);
                        } else { // UPDATE
                            var index = pouchObject.indexes[change._id];
                            var item = new PouchDbItem(data, index);
                            updateChild(index, item);
                        }
                    });
                } else { //DELETE
                    removeChild(change._id);
                    updateIndexes(pouchObject.indexes[change._id]);
                }
            }

            that.currentDb.changes({
                live: true,
                onChange: function(change) {
                    updateCollection(change);
                }
            });

            that.currentDb.allDocs({
                include_docs: true,
                attachments: false
            }).then(function (result) {
                // handle result
                for(var change in result.rows) {
                    updateCollection(result.rows[change].doc);
                }
            }).catch(function (err) {
                console.log(err);
            });

            return pouchObject;
        };
    }

    
})();

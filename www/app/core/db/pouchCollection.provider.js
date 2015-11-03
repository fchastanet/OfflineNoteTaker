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
            localDb: {
                options: {
                }
            },
            remoteDb: {
                collectionUrl: undefined
                options: {
                    skipSetup: true
                },
                user {
                    name: 'fchastanet', //TODO
                    password: 'fchastanet'
                }
            },
            sync: {
                options: {
                    live: true, 
                    retry: true
                }
            }
            debug: false
        };
        this.localDb = null;

        this.configure = function (config) {
            angular.extend(this.config, config);
        };
      
        var that = this;

        /* @ngInject */
        this.$get = function ($timeout, $window, $q, exception, logger) {
            that.localDb = new $window.PouchDB(that.config.dbName, that.config.localDb.options);

            if (that.config.debug) {
                $window.PouchDB.debug.enable('*');
            }            
            console.log('db.adapter :'+ that.localDb.adapter);

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
                localDb: that.localDb,
                sync: null
            };

            /*
             * PUBLIC METHODS
             */
            pouchObject.toggleOnline = toggleOnline;
            pouchObject.isOnline = isOnline;
            pouchObject.add = add;
            pouchObject.remove = remove;
            pouchObject.update = update;
            pouchObject.getItem = getItem;
            pouchObject.getList = getList;

            function getList() {
                var deferred = $q.defer();
                that.localDb.allDocs({
                    include_docs: true,
                    attachments: false
                }).then(function (result) {
                    // handle result
                    for(var change in result.rows) {
                        updateCollection(result.rows[change].doc);
                    }
                    deferred.resolve(pouchObject.collection);  
                }).catch(function (err) {
                    console.log(err);
                    deferred.reject({errorCode:'processError', error:err});
                });
                return deferred.promise;
            }

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

                that.localDb.get(itemId, {include_docs: true,attachments: true}).then(function (doc) {
                    deferred.resolve(doc);  
                }).catch(function (err) {
                  deferred.reject({errorCode:'processError', error:err});
                });
                
                return deferred.promise;
            }

            function cancelSync(deferred) {
                if (isOnline()) {
                    pouchObject.sync.removeAll('push');
                    pouchObject.sync.removeAll('pull');
                    pouchObject.sync.cancel();
                    pouchObject.sync = null;
                    var result = {data:null, code:'disconnectionSuccess', status:'stopped'};
                    deferred.resolve(result);
                }
            }

            function toggleOnline() {
                var deferred = $q.defer();
                if (pouchObject.sync == null) { // Read http://pouchdb.com/api.html#sync
                    //online requested
                    var remoteCouch = that.config.remoteDb.collectionUrl+that.config.dbName;
                    var remoteDb = new $window.PouchDB(remoteCouch, that.config.remoteDb.options);
                    var ajaxOpts = {
                      ajax: {
                        headers: {
                          Authorization: 'Basic ' + $window.btoa(that.config.remoteDb.user.name + ':' + that.config.remoteDb.user.password)
                        }
                      }
                    };

                    remoteDb.login(that.config.user.name, that.config.user.password, ajaxOpts).then(function() {
                        pouchObject.sync = pouchObject.localDb.sync(remoteDb, that.config.sync.options, syncError)
                            .on('change', function (info) {
                                // handle change
                                logger.debug('Pouchdb sync change', info);
                                var result = {data:info, code:'change', status:'running'};
                                deferred.notify(result);
                            })
                            .on('paused', function (info) {
                                // replication paused (e.g. user went offline)
                                //TODO si retry true : dans le cas du paused mettre une icone signifiant une recherche de reseau en cours
                                logger.debug('Pouchdb sync paused', info);
                                var result = {data:null, code:'pause', status:'running'};
                                deferred.notify(result);
                            })
                            .on('active', function (info) {
                                // replicate resumed (e.g. user went back online)
                                logger.debug('Pouchdb sync resumed', info);
                                var result = {data:null, code:'active', status:'running'};
                                deferred.notify(result);
                            })
                            
                            .on('denied', function (info) {
                                // a document failed to replicate, e.g. due to permissions
                                logger.debug('Pouchdb sync document failed to replicate', info);
                                var result = {data:info, code:'denied', status:'running'};
                                deferred.notify(result);
                            })
                            .on('complete', function (info) {
                                // handle complete
                                logger.debug('Pouchdb sync complete', info);
                                var result = {data:info, code:'syncComplete', status:'paused'};
                                deferred.resolve(result);
                                return result;
                            })
                            .on('error', syncError)
                            .on('requestError', syncError)
                        ;

                        function syncError(error, result) {
                            // handle error
                            logger.error('error while syncing ...', error);
                            var result = {data:(error)?error:result, code:'error', status:'running'};
                            deferred.reject(result);
                            cancelSync(deferred); //TODO forcément déconnecté ?
                        }                
                    }).catch(function(error) {
                      logger.info('Failed to connect to remote database');
                      console.error(error);
                    });
                    

                } else {
                    //offline requested, we stops the synchronization
                    cancelSync(deferred);
                    logger.info('Syncing halted by the user');
                }
                return deferred;
            }

            function isOnline() {
                return (pouchObject.sync !== null);
            }

            function add(item) {
                var deferred = $q.defer();
                try
                {
                    that.localDb.post(angular.copy(item)).then(
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
                that.localDb.remove(item);
            }

            function update(itemOrId) {
                var item = angular.isString(itemOrId) ? pouchObject.collection[itemOrId] : itemOrId;
                var copy = {};
                angular.forEach(item, function(value, key) {
                    if (key.indexOf('$') !== 0) {
                        copy[key] = value;
                    }
                });
                that.localDb.get(item._id).then(
                    function(res) {
                        that.localDb.put(copy, res._rev);
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
                    that.localDb.get(change._id).then(function(data) {
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

            that.localDb.changes({
                live: true,
                onChange: function(change) {
                    updateCollection(change);
                }
            });

            return pouchObject;
        };
    }

    
})();

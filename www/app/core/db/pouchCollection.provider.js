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
        this.pouchCollectionInstance = null;

        /* jshint validthis:true */
        this.config = {
            collectionUrl: undefined,
            options: {}
        };

        this.configure = function (config) {
            this.config.collectionUrl = config.collectionUrl;
            this.config.options = config.options;
        };

        /* @ngInject */
        this.$get = function ($timeout, pouchDB, $q, exception, logger) {
            if (this.pouchCollectionInstance) {
                return this.pouchCollectionInstance;
            }
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

            var pouchObject = {
                collection: [],
                indexes: {},
            };
            var db = pouchObject.db = pouchDB(this.config.collectionUrl, this.config.options);

            function getIndex(prevId) {
                return prevId ? pouchObject.indexes[prevId] + 1 : 0;
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
                    db.get(change._id).then(function(data) {
                        if (pouchObject.indexes[change._id] == undefined) { // CREATE / READ
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

            db.changes({
                live: true,
                onChange: function(change) {
                    updateCollection(change);
                }
            });

            var $toggleOnline = function() {
                pouchObject.collection.online = !pouchObject.collection.online;
                if (pouchObject.collection.online) { // Read http://pouchdb.com/api.html#sync
                    pouchObject.collection.sync = db.sync(this.config.collectionUrl, {live: true})
                        .on('error', function(err) {
                            logger.info('Syncing stopped');
                            logger.error(err);
                        });
                } else {
                    pouchObject.collection.sync.cancel();
                }
            };

            var $add = function(item) {
                var deferred = $q.defer();
                try
                {
                    db.post(angular.copy(item)).then(
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
            };
            var $remove = function(itemOrId) {
                var item = angular.isString(itemOrId) ? pouchObject.collection[itemOrId] : itemOrId;
                db.remove(item);
            };

            var $update = function(itemOrId) {
                var item = angular.isString(itemOrId) ? pouchObject.collection[itemOrId] : itemOrId;
                var copy = {};
                angular.forEach(item, function(value, key) {
                    if (key.indexOf('$') !== 0) {
                        copy[key] = value;
                    }
                });
                db.get(item._id).then(
                    function(res) {
                        db.put(copy, res._rev);
                    }
                );
            };

            /**
             * create a pouchCollection
             * from config {String} collectionUrl The pouchDB url where the collection lives
             * @return {Array}                An array that will hold the items in the collection
             */
            this.pouchCollectionInstance = {
                collection: [],
                online: false,
                /*
                 * PUBLIC METHODS
                 */
                $toggleOnline: $toggleOnline,
                $add: $add,
                $remove: $remove,
                $update: $update
            };
            return this.pouchCollectionInstance;
        };
    }

    
})();
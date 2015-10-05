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
            collectionUrl: undefined,
            options: {}
        };

        this.configure = function (config) {
            this.config.collectionUrl = config.collectionUrl;
            this.config.options = config.options;
        };

        /* @ngInject */
        this.$get = function ($timeout, pouchDB, exception, logger) {
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

            var data = {
                collection: [],
                indexes: {},
            };
            var db = data.db = pouchDB(this.config.collectionUrl, this.config.options);

            function getIndex(prevId) {
                return prevId ? data.indexes[prevId] + 1 : 0;
            }

            function addChild(index, item) {
                data.indexes[item._id] = index;
                data.collection.splice(index, 0, item);
                logger.info('added: ', index, item);
            }

            function removeChild(id) {
                var index = data.indexes[id];

                // Remove the item from the collection
                data.collection.splice(index, 1);
                data.indexes[id] = undefined;

                logger.info('removed: ', id);
            }

            function updateChild(index, item) {
                data.collection[index] = item;
                console.log('changed: ', index, item);
            }

            function moveChild(from, to, item) {
                data.collection.splice(from, 1);
                data.collection.splice(to, 0, item);
                updateIndexes(from, to);
                console.log('moved: ', from, ' -> ', to, item);
            }

            function updateIndexes(from, to) {
                var length = data.collection.length;
                to = to || length;
                if (to > length) {
                    to = length;
                }
                for (var index = from; index < to; index++) {
                    var item = data.collection[index];
                    item.$index = data.indexes[item._id] = index;
                }
            }

            db.changes({
                live: true,
                onChange: function(change) {
                    if (!change.deleted) {
                        db.get(change.id).then(function(data) {
                            if (data.indexes[change.id] == undefined) { // CREATE / READ
                                addChild(data.collection.length, new PouchDbItem(data, collection.length)); // Add to end
                                updateIndexes(0);
                            } else { // UPDATE
                                var index = data.indexes[change.id];
                                var item = new PouchDbItem(data, index);
                                updateChild(index, item);
                            }
                        });
                    } else { //DELETE
                        removeChild(change.id);
                        updateIndexes(data.indexes[change.id]);
                    }
                }
            });

            var $toggleOnline = function() {
                data.collection.online = !data.collection.online;
                if (data.collection.online) { // Read http://pouchdb.com/api.html#sync
                    data.collection.sync = db.sync(this.config.collectionUrl, {
                            live: true
                        })
                        .on('error', function(err) {
                            logger.info('Syncing stopped');
                            logger.error(err);
                        });
                } else {
                    data.collection.sync.cancel();
                }
            };

            var $add = function(item) {
                db.post(angular.copy(item)).then(
                    function(res) {
                        item._rev = res.rev;
                        item._id = res.id;
                    }
                );
            };
            var $remove = function(itemOrId) {
                var item = angular.isString(itemOrId) ? data.collection[itemOrId] : itemOrId;
                db.remove(item);
            };

            var $update = function(itemOrId) {
                var item = angular.isString(itemOrId) ? data.collection[itemOrId] : itemOrId;
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
            return {
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
        };
    }

    
})();

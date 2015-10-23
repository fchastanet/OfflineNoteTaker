/** 
 * https://wiki.apache.org/couchdb/Document_Update_Validation
 * http://guide.couchdb.org/draft/validation.html
 */
{
    "_id": "_design/node",
    "_rev": "1-C1687D17",
    "validate_doc_update":
        /* @stringify */
        function(newDoc, oldDoc, userCtx, secObj) {
            function require(field, message) {
                message = message || "Document must have a " + field;
                if (!newDoc[field]) throw ({forbidden: message});
            };

            require("_id");
            require("type");
            require("creationDate");
            require("title");
            require("author");
            require("contentFormat"); //markdown, ...
            require("content");
            require("fields");
            
            function requireType(field, fieldType, message) {
                message = message || "Field "+field+" must be " + fieldType;
                if (typeof newDoc[field] !== fieldType) throw ({forbidden: message});
            };            

            requireType('type', 'string'); //todo enum
            requireType('creationDate', 'string'); //todo format
            requireType('title', 'string'); //todo not empty, ensure unique
            requireType('author', 'string'); //todo not empty
            requireType('contentFormat', 'string'); //todo enum
            requireType('content', 'string');
            requireType('fields', 'object');
            //todo validate each field

            function unchanged(field) {
                if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field]))
                  throw({forbidden : "Field can't be changed: " + field});
            }
            unchanged("creationDate");
            unchanged("_id");
        },
    "views": {
        "by_title": {
            "map": 
                /* @stringify */
                function(doc) {
                    if (doc.title) {
                        emit(doc.title);
                    }
                }
        },
    }
}

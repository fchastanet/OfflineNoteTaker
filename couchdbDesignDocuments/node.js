/** 
 * https://wiki.apache.org/couchdb/Document_Update_Validation
 * http://guide.couchdb.org/draft/validation.html
 */
{
    '_id': '_design/node',
    'validate_doc_update':  
        /*<stringify>*/
        function(newDoc, oldDoc, userCtx, secObj) {
            function require(field , message) {
                message = message || 'Document must have a ' + field;
                if (!newDoc[field]) throw ({forbidden: message});
            };     
   
            require('_id'); 
            require('type');   
            require('creationDate'); 
            require('title');    
            require('author');   
            require('contentFormat');  //markdown, ...
            require('content'); 
            require('fields'); 
            
            function requireType(field, fieldType, message) {
                message = message || 'Field '+field+' must be ' + fieldType;
                if (typeof newDoc[field] !== fieldType) {
                    throw ({forbidden: message});
                }
            };            

            requireType('type', 'string'); 
            requireType('creationDate', 'string'); //todo format
            requireType('title', 'string'); //todo not empty, ensure unique
            requireType('author', 'string'); //todo not empty 
            requireType('contentFormat', 'string');
            requireType('content', 'string');
            requireType('fields', 'object');
            //todo validate each field 

            function unchanged(field, message) { 
                message = message || 'Field can\'t be changed: ' + field;
                if (oldDoc && toJSON(oldDoc[field]) != toJSON(newDoc[field])) {
                  throw({forbidden : message});
                }
            }
            unchanged('creationDate'); 
            unchanged('_id');

            function enumField(field, valueList, message) {
                message = message || 'Field '+field+' value must be one of ' + valueList.join();
                if (typeof newDoc[field] !== 'undefined' && valueList.indexOf(newDoc[field]) === -1) {
                  throw({forbidden : message});
                }
            }
            enumField('type', ['lyrics']);
            enumField('contentFormat', ['makdown', 'html', 'plainText']);

        }/*</stringify>*/
    ,'views': {
        'by_title': {
            'map': 
                /*<stringify>*/
                function(doc) {
                    if (doc.title) {
                        emit(doc.title);
                    }
                }
                /*</stringify>*/
        }
    }
}

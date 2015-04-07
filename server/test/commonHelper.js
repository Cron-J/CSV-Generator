var Config = require('../config/config');

exports.removeCollections = function(mongoose, callback){
    mongoose.connection.db.collectionNames(function(err, collections){
        if(collections.map(function(e) { return e.name; }).indexOf(Config.database.db+'.mappings') != -1) {
                mongoose.connection.db.dropCollection('mappings', function(err) {
                callback(err);
            });
        }
        else{
            callback();
        }
    });
};
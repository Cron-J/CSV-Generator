// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  mapinfo = require('./mapinfo').Mapinfo,
  delimeter = require('./delimeter').Delimeter,
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;


var MappingSchema = new Schema({

  /** tenant id is indexed */
  tenantId : { type: String, required: true, index: true },

  mappingName : { type: String, required: true },

  fileName : { type: String, required: true },

  mappingInfo : [mapinfo],

  delimeter : delimeter


});

/**
 * Date when the ContractedProduct was created.
 * Date when the ContractedProduct was changed last time.
 */
MappingSchema.plugin(timestamps);

MappingSchema.statics.createMapping = function(mapping, callback) {
    this.create(mapping, callback);
};

MappingSchema.statics.getMappingList = function(tenantId, callback) {
    this.find({'tenantId': tenantId}, {mappingName: 1}, callback);
};

MappingSchema.statics.getMappedData = function(tenantId, mappingId, callback) {
    this.find({_id:mappingId,'tenantId': tenantId}, callback);
};

// export
var mapping = mongoose.model('Mapping', MappingSchema);

/** export schema */
module.exports = {
    Mapping : mapping
};
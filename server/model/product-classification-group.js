// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

// schema
var Product2ClassificationGroupSchema = new Schema({
  /**
   * Classification Group assigned to the <code>product</code>
   */
  productId : {type: String},

  /**
   * Identifier of Classification.
   */
  classificationId : {type: String},

  /**
   * Identifier of Classification Group within Classification.
   */
  classificationGroupId : {type: String},
  
  /**
   * Order number. Used for sorting associations, e.g. on UI.
   */
  orderNro : {type: Number},

  /**
   * User name who has created the Product2ClassificationGroup.
   */
  createdBy : {type: String},

  /**
   * User name who has changed the Product2ClassificationGroup last time.
   */
  updatedBy : {type: String}
});

/**
 * Date when the Product2ClassificationGroup was created.
 * Date when the Product2ClassificationGroup was changed last time.
 */
Product2ClassificationGroupSchema.plugin(timestamps);

// export
var product2ClassificationGroup = mongoose.model('Product2ClassificationGroup', Product2ClassificationGroupSchema);

/** export schema */
module.exports = {
    Product2ClassificationGroup : product2ClassificationGroup
};
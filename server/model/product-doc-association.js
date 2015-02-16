// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

// schema
var ProductDocAssociationSchema = new Schema({
  /**
   * Path to external document (image, pdf and etc).
   */
  path : {type: String},

  /**
   * Identifier of Document view type.
   */
  documentViewTypeId : {type: String},

  /**
   * Order number.
   */
  orderNo : {type: Number},

  /**
   * Identifier of Language.
   */
  languageId : {type: String},
  
  /**
   * Description.
   */
  description : {type: String},

  /**
   * Product valid range from.
   */
  validFrom : {type: Date},

  /**
   * Product valid range to.
   */
  validTo : {type: Date},

  /**
   * User name who has created the ProductDocAssociation.
   */
  createdBy : {type: String},

  /**
   * User name who has changed the ProductDocAssociation last time.
   */
  updatedBy : {type: String}
});

/**
 * Date when the ProductDocAssociation was created.
 * Date when the ProductDocAssociation was changed last time.
 */
ProductDocAssociationSchema.plugin(timestamps);

// export
var productDocAssociation = mongoose.model('ProductDocAssociation', ProductDocAssociationSchema);

/** export schema */
module.exports = {
    ProductDocAssociation : productDocAssociation
};
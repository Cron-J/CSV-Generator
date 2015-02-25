// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * Defines relation between two products.
 *
 * @author Alexander Pyrkh
 */
var ProductRelationSchema = new Schema({

  /**
   * This product has relation to product in catalog {@link #relatedCatalogId} and has identifier {@link #relatedProductId}
   */
  productId : {type: String},

  /**
   * Identifier of related product.
   */
  relatedProductId : {type: String},

  /**
   * Identifier of related product.
   */
  relatedCatalogId : {type: String},

  /**
   * Identifier of related product.
   */
  relatedTenantId : {type: ObjectId},

  /**
   * Translated descriptions of ProductRelation.
   * key is languageId, value is description for language
   */
  descriptions : [{type: String}],

  /**
   * Identifier of Product Relation Type.
   */
  typeId : {type: String},

  /**
   * Relation valid range from.
   */
  validFrom : {type: Date},

  /**
   * Relation valid range to.
   */
  validTo : {type: Date},

  /**
   * Relation Quantity.
   */
  quantity : {type: Number},
  
  /**
   * Identifier of product relation Status.
   */
  statusId : {type: String},

  /**
   * Relation SeqNo.
   */
  seqNo : {type: String},

  /**
   *  Base UDX info: text info for any purposes.
   */
  udxText1 : {type: String},

  /**
   *  Base UDX info: text info for any purposes.
   */
  udxText2 : {type: String},

  /**
   *  Base UDX info: text info for any purposes.
   */
  udxText3 : {type: String},

  /**
   *  Base UDX info: numeric info for any purposes.
   */
  udxNum1 : {type: Number},

  /**
   *  Base UDX info: numeric info for any purposes.
   */
  udxNum2 : {type: Number},

  /**
   *  Base UDX info: numeric info for any purposes.
   */
  udxNum3 : {type: Number},

  /**
   *  Base UDX info: info for any sorting purposes.
   */
  udxSortKey1 : {type: String},

  /**
   *  Base UDX info: info for any sorting purposes.
   */
  udxSortKey2 : {type: String},

  /**
   *  Base UDX info: info for any sorting purposes.
   */
  udxSortKey3 : {type: String},

  /**
   * Sync type Id.
   */
  syncTypeId : {type: String},

  /**
   * IsMandatory.
   */
  isMandatory : {type: Boolean},

  /**
   * Selection Group Id.
   */
  selectionGroupId : {type: String},

  /**
   * Is used to decide whether corresponding related product
   * should be selected by default within a kit/configurable product.
   */
  isDefaultSelected : {type: Boolean},

  /**
   * User name who has created the ProductRelation.
   */
  createdBy : {type: String},

  /**
   * User name who has changed the ProductRelation last time.
   */
  updatedBy : {type: String}
});

/**
 * Date when the ProductRelation was created.
 * Date when the ProductRelation was changed last time.
 */
ProductRelationSchema.plugin(timestamps);

// export
var productRelation = mongoose.model('ProductRelation', ProductRelationSchema);

/** export schema */
module.exports = {
    ProductRelation : productRelation
};
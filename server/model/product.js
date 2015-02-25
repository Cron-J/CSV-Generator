// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * <p>Common Product with primitive types for fields and collections of ProductRelations, ContractedProducts, Prices, Product2ClassificationGroups, ProductAttributeValues and ProductDocAssociation
 *
 * <p>Products belong to the most important items of the catalog application.
 * A product is an item that is presented, or offered, or purchased via the catalog.
 * Basic information and properties of a product are maintained as fields with primitive type
 * Advanced and detailed information, such as an arbitrary number of prices, product
 * descriptions in different languages, and related documents are maintained in separate classes.</p>
 *
 * @author Alexander Pyrkh
 */
var ProductSchema = new Schema({
  /**
   * Identifier of Product's Tenant this product is listed in.
   */
  tenantId : {type: String, index: true},

  /**
   *  Identifier inside the product catalog. Together with catalogId this is globally unique.
   */
  productId : {type: String, index: true, required: true},

  /**
   * Identifier of Product's Catalog this product is listed in.
   */
  catalogId : {type: String, index: true},

  /**
   * Identifier of the Supplier who own the product.
   */
  supplierId : {type: String, index: true},

  /**
   * Identifier of product status (like <i>800 - deleted</i>, <i>400 - confirmed</i>, etc).
   */
  statusId : {type: String},
  
  /**
   * Manufacturer article identifier.
   */
  mfgProductId : {type: String},

  /**
   * Manufacturer article name. (WARN: in PIM this is same fields means <code>manufacturerName</code> because <code>mfgProductName</code> doesn't exist in PIM)
   */
  mfgProductName : {type: String},
  
  /**
   * Identifier of Manufacturer of the product.
   */
  manufactererId : {type: String},

  /**
   * The name of the manufacturer of the product. (WARN: in PIM the same fields means <code>mfgProductName</code> because <code>mfgProductName</code> doesn't exist in PIM)
   */
  manufactererName : {type: String},
  
  /**
   *  External product ID. Useful when external products are mapped to jCatalog using a different set of ids.
   */
  extProductId : {type: String},

  /**
   *  Extension to {@link #productId}. Useful in scope of Master/Variants scenarios to store the variant's Id suffix.
   */
  productIdExtension : {type: String},

  /**
   * Identifier of additional UOM for BMECat CONTENT_UNIT.
   */
  unitOfMeasureId : {type: String},

  /**
   * Identifier of UOM to be used for this product when ordered. This is also the unit the price is related to.
   */
  salesUnitOfMeasureId : {type: String},

  /**
   * Keywords that are used for searching products, separated by white space.
   */
  keywords : {type: String},

  /**
   * EAN/GTIN  internationally unique article number
   */
  ean : {type: String},

  /**
   * Defines does product belong to the core assortment for a particular customer.
   */
  isMainProdLine : {type: Boolean},

  /**
   * Defines is product for sale.
   */
  isForSales : {type: Boolean},

  /**
   * Defines is product available only in context of special offer
   */
  isSpecialOffer : {type: Boolean},

  /**
   * Defines is product in stock
   */
  isStocked : {type: Boolean},

  /**
   * Identification of punchout product. If true this will allow to jump
   * to external catalogs instead direct add to cart in OPC. Requires
   * punchout configuration via script exit.
   */
  isPunchout : {type: Boolean},

  /**
   * Flags a product as configurable with PSC.
   */
  isConfigurable : {type: Boolean},

  /**
   * Product valid range from.
   */
  validFrom : {type: Date},

  /**
   * Product valid range to.
   */
  validTo : {type: Date},

  /**
   * User name who has created the Product.
   */
  createdBy : {type: String},

  /**
   * User name who has changed the Product last time.
   */
  updatedBy : {type: String},

  /**
   * Set of {@link Product2ClassificationGroup}s.
   */
  classificationGroupAssociations : [{ type: ObjectId, ref: 'Product2ClassificationGroup' }],

  /**
   * Set of {@link ProductAttributeValue}s.
   */
  attributeValues : [{ type: ObjectId, ref: 'ProductAttributeValue' }],

  /**
   * Set of {@link ContractedProduct}s. {@link ContractedProduct} links the product to a contract as part of it's assortment.
   */
  contractedProducts : [{ type: ObjectId, ref: 'ContractedProduct' }],

  /**
   * Set of {@link Price}s.
   */
  prices : [{ type: ObjectId, ref: 'Price' }],

  /**
   * Set of {@link ProductRelation}s.
   */
  productRelations : [{ type: ObjectId, ref: 'ProductRelation' }],

  /**
   * Set of {@link ProductDocAssociation}s.
   */
  documents : [{ type: ObjectId, ref: 'ProductDocAssociation' }]
});

/**
 * Date when the Product was created.
 * Date when the Product was changed last time.
 */
ProductSchema.plugin(timestamps);


/**
 * Find Product Methods
 */
ProductSchema.statics.findProductByID = function(tenantId, id, cb) {
  this.findOne({_id: id, tenantId: tenantId}).populate('attributeValues').exec(cb);
}

ProductSchema.statics.findProductsByClassGrp = function(tenantId, classificationId, classGrpId, cb) {
  var stream = this.find({
    tenantId: tenantId, 
    'classificationGroupAssociations.classificationId': classificationId,
    'classificationGroupAssociations.classificationGroupId': classGrpId 
  }).populate('attributeValues').stream();

  return cb(stream);
}

ProductSchema.statics.findProductsByClassGrps = function(tenantId, classGroups, cb) {
  var stream = this.find({
    tenantId: tenantId, 
    'classificationGroupAssociations.classificationGroupId': { $in: req.classGroups }
  }).populate('attributeValues').stream();
  
  return cb(stream);
}

// export
var product = mongoose.model('Product', ProductSchema);

/** export schema */
module.exports = {
    Product : product
};

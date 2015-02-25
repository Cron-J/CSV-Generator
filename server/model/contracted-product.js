// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * Defines contract specific information for Product. It is used to assign a product to a contract.
 *
 * @author Alexander Pyrkh
 */
var ContractedProductSchema = new Schema({
  /**
   * Product.
    */
  productId : {type: String},
  
  /**
   * Identifier(contractId) of Contract.
   */
  contractId : {type: String},

  /**
   * Identifier(statusId) of contracted product Status.
   */
  statusId : {type: String},
  
  /**
   *  External product ID. Useful when external products are mapped to jCatalog using a different set of ids.
   */
  extProductId : {type: String},

  /**
   * Alternative customer specific product identifier.
   */
  altExtProductId : {type: String},

  /**
   * Identifier(classificationId) of customer specific classification.
   */
  extClassificationId : {type: String},

  /**
   * Identifier(classificationGroupId) of customer specific classification group.
   */
  extClassificationGroupId : {type: String},

  /**
   * Short description.
   */
  descShort : {type: String},

  /**
   * Long description.
   */
  descLong : {type: String},

  /**
   * Identifier(GLAccountId) of GLAccount.
   */
  extGLAccountId : {type: String},

  /**
   * A fraction or multiple of the order unit that indicates the quantity to
   * which all specified prices refer. If nothing is specified in this field, the
   * default value 1 is assumed, in other words the price refers to exactly one order
   * unit.
   */
  priceQuantity : {type: Number},

  /**
   * The minimum incremental amount of the product that may be puchased. Orders
   * must be in a multiple of the lotsize. NULL or 1.0 indicate that the item must be
   * purchased in whole number lots. The LotSize can be any number greater than or
   * equal to 0. It is not restricted to BigDecimal values.
   */
  quantityInterval : {type: Number},

  /**
   * The maximum quantity of the product that may be purchased. NULL indicates
   * that there is no maximum.
   */
  maxQuantity : {type: Number},

  /**
   * The minimum quantity of the product that may be purchased.  NULL (or 0.0)
   * indicate that there is no minimum.
   */
  minQuantity : {type: Number},

  /**
   * The lead time, in days, for shipment of this product. In other words,
   * time in working days needed by supplier to supply the product.
   */
  leadtimeInDays : {type: Number},

  /**
   * Identifier(unitOfMeasureId) of Sales UnitOfMeasure for Product within the current Product.
   */
  salesUnitOfMeasureId : {type: String},

  /**
   *  Currently just used for information purposes.
   */
  timePeriod : {type: String},

  /**
   * Visibility for contract assortment control. It was used up to CS71.
   * Added it for compatibility with PIM Product Model.
   * We don't use it in services of STD version.
   */
  visibility : {type: Number},

  /**
   * Unit of measure to be applied on quantity.
   * Currently just used for information purposes. We don't use it in services of STD version.
   *
   */
  unitOfMeasureId : {type: String},

  /**
   * Cost and Currency work together to define a monetary amount.
   * Currently just used for information purposes.
   */
  cost : {type: Number},

  /**
   * Cost and Currency work together to define a monetary amount.
   * Currently just used for information purposes.
   */
  currencyId : {type: String},
  
  /**
   * Amount and unitOfMeasureId together define a quantity.
   * Currently just used for information purposes.
   */
  ammount : {type: Number},

  /**
   * Last change of status field. (Not automated filling).
   */
  statusDate : {type: Date},

  /**
   * Discount. It defines what price discount applies to products in the contracted
   * catalog.
   */
  discount : {type: Number},

  /**
   * User name who has created the ContractedProduct.
   */
  createdBy : {type: String},

  /**
   * User name who has changed the ContractedProduct last time.
   */
  updatedBy : {type: String}
});

/**
 * Date when the ContractedProduct was created.
 * Date when the ContractedProduct was changed last time.
 */
ContractedProductSchema.plugin(timestamps);

// export
var contractedProduct = mongoose.model('ContractedProduct', ContractedProductSchema);

/** export schema */
module.exports = {
    ContractedProduct : contractedProduct
};
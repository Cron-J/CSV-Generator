// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

/**
 * <p>Product's price for defined contract (contractId), validFromQuantity, currency (currencyId), valid range (validFrom - validTo) and priceType (priceType)</p>
 *
 * The <code>netPrice</code> field defines price value.
 *
 * @author Alexander Pyrkh
 */
var PriceSchema = new Schema({
  /**
   * Price belongs to the <code>product</code>
   */
  productId : {type: String},

  /**
   * Identifier of Contract.
   */
  contractId : {type: String},

  /**
   * Identifier of price Status.
   */
  statusId : {type: String},

  /**
   * Identifier of Currency.
   */
  currencyId : {type: String, required: true},

  /**
   * Identifier of Price type.
   */
  priceTypeId : {type: String},

  /**
   * Value of Price.
   */
  netPrice : {type: Number, required: true},

  /**
   * Value of grossPrice. use netPrice in combination with priceTypeId
   */
  grossPrice : {type: Number},

  /**
   * Value of fixNetPrice. use netPrice in combination with priceTypeId
   */
  fixNetPrice : {type: Number},

  /**
   * Value of listPrice. use netPrice in combination with priceTypeId
   */
  listPrice : {type: Number},

  /**
   * Price is valid from quantity
   */
  validFromQuantity : {type: Number, required: true},

  /**
   * Price valid range from.
   */

  validFrom : {type: Date},
  /**
   * Price valid range to.
   */
  validTo : {type: Date},
  
  /**
   * Identifier of UnitOfMeasure for Price.
   */
  unitOfMeasureId : {type: String},

  /**
   * ProductIdExtensionForUoM.
   */
  productIdExtensionForUoM : {type: String},

  /**
   * Price unit.
   */
  priceUnit : {type: Number},

  /**
   * Description.
   */
  description : {type: String},

  /**
   * Vat percentage.
   */
  vatPercentage : {type: Number},

  /**
   * Is preferred.
   */
  isPreferred : {type: Boolean, required: true},

  /**
   * User name who has created the Price.
   */
  createdBy : {type: String},

  /**
   * User name who has changed the Price last time.
   */
  updatedBy : {type: String}
});

/**
 * Date when the Price was created.
 * Date when the Price was changed last time.
 */
PriceSchema.plugin(timestamps);

// export
price = mongoose.model('Price', PriceSchema);

/** export schema */
module.exports = {
    Price : price
};
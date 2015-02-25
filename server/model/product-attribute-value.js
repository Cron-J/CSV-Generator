// dependencies
var mongoose = require('mongoose'),
  timestamps = require('mongoose-timestamp'),
  Schema = mongoose.Schema;

/**
 * <p>Gives possibility to define attribute values (dynamic fields) for Product.</p>
 *
 * <p>
 *  Identified by <code>attributeId</code> within Product and <code>languageId</code> if Attribute is multi-language.
 *  Several attribute values for the same <code>attributeId</code> and <code>languageId</code> is possible if Attribute is multivalued.
 * </p>
 * <p>
 *  The <code>value</code> has {@link String} representation but Attribute can have other types like Date, Integer, Boolean and in this
 *  case corresponding external handling must take care to convert real value to string representation and vice verse.
 *  The information about Attribute like type, is is multi-language, is multivalued must be reached by <code>attributeId</code> where ProductAttributeValue is used.
 * </p>
 *
 * <p>Also contains constants for attribute identifiers most used in jCatalog applications<p>
 *     <ul>
 *         <li>Texts</li>
 *         <ul>
 *         <li>LongDescription</li>
 *         <li>ShortDescription</li>
 *         </ul>
 *         <li>Documents</li>
 *         <ul>
 *         <li>DocumentNormal</li>
 *         <li>DocumentDetails</li>
 *         <li>DocumentThumbnail</li>
 *         <li>DocumentPicture</li>
 *         <li>DocumentWebsite</li>
 *         <li>DocumentMSDS</li>
 *         <li>DocumentTechSpec</li>
 *         <li>DocumentDrawing</li>
 *         <li>DocumentVideo</li>
 *         <li>DocumentOther</li>
 *         </ul>
 *     </ul>
 *
 * @author Alexander Pyrkh
 */
var ProductAttributeValueSchema = new Schema({  
  attribute : {type: String, enum: [
    /** attributeId for Product's Long Description, usually this attribute is handled as multi-language */
    'LongDescription', 
    /** attributeId for Product's Short Description, usually this attribute is handled as multi-language */
    'ShortDescription', 
    /** attributeId for Product's Normal Document */
    'DocumentNormal',
    /** attributeId for Product's Details Document */
    'DocumentDetails',
    /** attributeId for Product's Thumbnail Document */
    'DocumentThumbnail',
    /** attributeId for Product's Picture Document */
    'DocumentPicture',
    /** attributeId for Product's Website Document */
    'DocumentWebsite',
    /** attributeId for Product's MSDS Document */
    'DocumentMSDS',
    /** attributeId for Product's TechSpec Document */
    'DocumentTechSpec',
    /** attributeId for Product's Drawing Document */
    'DocumentDrawing',
    /** attributeId for Product's Video Document */
    'DocumentVideo',
    /** attributeId for Product's Other Document */
    'DocumentOther'
  ], required: true},

  /**
   * Attribute belongs to the <code>product</code>
   */
  productId : {type: String},

  /**
   * String representation of value.
   */
  value : {type: String, required: true},

  /**
   * Identifier of Language for multi language attribute.
   */
  languageId : {type: String},

  /**
   * Attribute value Order Number. It can be used for different kind sorting.
   */
  orderNro : {type: Number},

  /**
   * Identifier of product attribute value Status.
   */
  statusId : {type: String},

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
ProductAttributeValueSchema.plugin(timestamps);

// export
productAttributeValue = mongoose.model('ProductAttributeValue', ProductAttributeValueSchema);

/** export schema */
module.exports = {
    ProductAttributeValue : productAttributeValue
};
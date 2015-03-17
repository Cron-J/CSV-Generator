var productAttributeValue = {

    attribute: {
        type: String,
        enum: [
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
        ],
        required: true
    },

    /**
     * String representation of value.
     */
    value: {
        type: String,
        required: true
    },

    /**
     * Identifier of Language for multi language attribute.
     */
    languageId: {
        type: String
    },

    /**
     * Attribute value Order Number. It can be used for different kind sorting.
     */
    orderNro: {
        type: Number
    },

    /**
     * Identifier of product attribute value Status.
     */
    statusId: {
        type: String
    }

};

/** export schema */
module.exports = {
    ProductAttributeValue: productAttributeValue
};
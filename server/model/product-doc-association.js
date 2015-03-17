var productDocAssociation = {
    /**
     * Path to external document (image, pdf and etc).
     */
    path: {
        type: String
    },

    /**
     * Identifier of Document view type.
     */
    documentViewTypeId: {
        type: String
    },

    /**
     * Order number.
     */
    orderNo: {
        type: Number
    },

    /**
     * Identifier of Language.
     */
    languageId: {
        type: String
    },

    /**
     * Description.
     */
    description: {
        type: String
    },

    /**
     * Product valid range from.
     */
    validFrom: {
        type: Date
    },

    /**
     * Product valid range to.
     */
    validTo: {
        type: Date
    }

};

/** export schema */
module.exports = {
    ProductDocAssociation: productDocAssociation
};
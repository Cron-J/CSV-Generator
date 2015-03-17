var product2ClassificationGroup = {

    /**
     * Identifier of Classification.
     */
    classificationId: {
        type: String,
        required: true
    },

    /**
     * Identifier of Classification Group within Classification.
     */
    classificationGroupId: {
        type: String,
        required: true
    },

    /**
     * Order number. Used for sorting associations, e.g. on UI.
     */
    orderNo: {
        type: Number
    }

};


/** export schema */
module.exports = {
    Product2ClassificationGroup: product2ClassificationGroup
};
var productRelation = {

    /**
     * Identifier of related product.
     */
    relatedProductId: [{
        type: String
    }],

    /**
     * Translated descriptions of ProductRelation.
     * key is languageId, value is description for language
     */
    descriptions: [{
        type: String
    }],

    /**
     * Identifier of Product Relation Type.
     */
    typeId: {
        type: String
    },

    /**
     * Relation valid range from.
     */
    validFrom: {
        type: Date
    },

    /**
     * Relation valid range to.
     */
    validTo: {
        type: Date
    },

    /**
     * Relation Quantity.
     */
    quantity: {
        type: Number
    },

    /**
     * Identifier of product relation Status.
     */
    statusId: {
        type: String
    },

    /**
     * Relation SeqNo.
     */
    seqNo: {
        type: String
    },

    /**
     *  Base UDX info: text info for any purposes.
     */
    udxText1: {
        type: String
    },

    /**
     *  Base UDX info: text info for any purposes.
     */
    udxText2: {
        type: String
    },

    /**
     *  Base UDX info: text info for any purposes.
     */
    udxText3: {
        type: String
    },

    /**
     *  Base UDX info: numeric info for any purposes.
     */
    udxNum1: {
        type: Number
    },

    /**
     *  Base UDX info: numeric info for any purposes.
     */
    udxNum2: {
        type: Number
    },

    /**
     *  Base UDX info: numeric info for any purposes.
     */
    udxNum3: {
        type: Number
    },

    /**
     *  Base UDX info: info for any sorting purposes.
     */
    udxSortKey1: {
        type: String
    },

    /**
     *  Base UDX info: info for any sorting purposes.
     */
    udxSortKey2: {
        type: String
    },

    /**
     *  Base UDX info: info for any sorting purposes.
     */
    udxSortKey3: {
        type: String
    },

    /**
     * Sync type Id.
     */
    syncTypeId: {
        type: String
    },

    /**
     * IsMandatory.
     */
    isMandatory: {
        type: Boolean
    },

    /**
     * Selection Group Id.
     */
    selectionGroupId: {
        type: String
    },

    /**
     * Is used to decide whether corresponding related product
     * should be selected by default within a kit/configurable product.
     */
    isDefaultSelected: {
        type: Boolean
    }

};

/** export schema */
module.exports = {
    ProductRelation: productRelation
};
var price = {
   
    /**
     * Identifier of Contract.
     */
    contractId: {
        type: String
    },

    /**
     * Identifier of price Status.
     */
    statusId: {
        type: String
    },

    /**
     * Identifier of Currency.
     */
    currencyId: {
        type: String,
        required: true
    },

    /**
     * Identifier of Price type.
     */
    priceTypeId: {
        type: String
    },

    /**
     * Value of Price.
     */
    netPrice: {
        type: Number,
        required: true
    },

    /**
     * Value of grossPrice. use netPrice in combination with priceTypeId
     */
    grossPrice: {
        type: Number
    },

    /**
     * Value of fixNetPrice. use netPrice in combination with priceTypeId
     */
    fixNetPrice: {
        type: Number
    },

    /**
     * Value of listPrice. use netPrice in combination with priceTypeId
     */
    listPrice: {
        type: Number
    },

    /**
     * Price is valid from quantity
     */
    validFromQuantity: {
        type: Number,
        required: true
    },

    /**
     * Price valid range from.
     */

    validFrom: {
        type: Date
    },
    /**
     * Price valid range to.
     */
    validTo: {
        type: Date
    },

    /**
     * Identifier of UnitOfMeasure for Price.
     */
    unitOfMeasureId: {
        type: String
    },

    /**
     * ProductIdExtensionForUoM.
     */
    productIdExtensionForUoM: {
        type: String
    },

    /**
     * Price unit.
     */
    priceUnit: {
        type: Number
    },

    /**
     * Description.
     */
    description: {
        type: String
    },

    /**
     * Vat percentage.
     */
    vatPercentage: {
        type: Number
    },

    /**
     * Is preferred.
     */
    isPreferred: {
        type: Boolean,
        required: true
    }

};

/** export schema */
module.exports = {
    Price: price
};
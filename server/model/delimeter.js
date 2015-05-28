/**
 * @class Delimeters
 * @classdesc delimeters contain field details
 */
var delimeter = {

 	includeHeader: {
        type: Boolean,
        required: true
    },

    dateFormat : {
        type: String,
        required: true
    },

    numberFormat : {
        type: String,
        required: true
    },

    delimeterFormat : {
        type: String,
        required: true
    }

};

module.exports = {
    Delimeter: delimeter
}

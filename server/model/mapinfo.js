/**
 * @class Mapinfo
 * @classdesc mapinfo contain field details
 */
var mapinfo = {

    /** 
      userFieldName. It will come from header of uploaded csv.
    */

    userFieldName: {
        type: String
    },

    /** 
      transformations. transformation applied on fields.
    */

    transformations: [{
        type: String
    }],

    field: {
        type: String
    },

    values: [{
     
        userFieldName: {
            type: String
        },

        transformations: [{
            type: String
        }],

        field: {
            type: String
        },

        index: {
            type: Boolean
        },

        instance: {
            type: String
        },

        isRequired: {
            type: String,
            default: false
        }
    }],

    index: {
        type: Boolean
    },

    instance: {
        type: String
    },

    isRequired: {
        type: String,
        default: false
    }
};


module.exports = {
    Mapinfo: mapinfo
}
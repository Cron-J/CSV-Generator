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

    transformations: {
        type: Object
    },

    field: {
        type: String
    },

    defaultValue : {
        type: String
    },

    values: [{

        fields: [{

            rowId: {
                type: Number
            }, 
         
            userFieldName: {
                type: String
            },

            transformations: {
                type: Object
            },

            field: {
                type: String
            },

            defaultValue : {
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
        }]
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
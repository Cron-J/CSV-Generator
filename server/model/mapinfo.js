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
      Building. Collection name where data is to be put.
    */

    collectionName: {
        type: String
    },

    /** 
      transformations. transformation applied on fields.
    */

    transformations: [{
        type: String
    }],

    
    fieldDetail: {

        field: {
            type: String
        },

        index: {
            type: Boolean
        },

        instance: {
            type: String
        },

        isArray: {
            type: String,
            default: false
        },

        isRequired: {
            type: String,
            default: false
        }

    }   

   
};


module.exports = {
    Mapinfo : mapinfo
}
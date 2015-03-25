var Joi = require('joi'),
    Boom = require('boom'),
    fs=require('fs'),
    Converter=require("csvtojson").core.Converter,
    Mapping = require('../model/mapping').Mapping;

exports.createMapping = {
    handler: function(request, reply) {
    	Mapping.createMapping(request.payload, function(err, mapping){
    		if (!err) {
	            reply(mapping);
	        } else {
	             reply(Boom.forbidden(err));
	        }
    	});
    }
}

exports.getMappingList = {
    handler: function(request, reply) {
    	Mapping.getMappingList(request.params.tenantId, function(err, mappings){
    		if (!err) {
	            reply(mappings);
	        } else {
	             reply(Boom.forbidden(err));
	        }
    	});
    }
}

exports.getMappingData = {
    handler: function(request, reply) {
    	Mapping.getMappedData(request.params.tenantId, request.params.mappingId, function(err, mappings){
    		if (!err) {
                var upload_path = 'upload/' + mappings[0].fileName;
                var fileStream=fs.createReadStream(upload_path);
                //new converter instance 
                var csvConverter=new Converter({constructResult:true});

                //end_parsed will be emitted once parsing finished 
                csvConverter.on("end_parsed",function(jsonObj){
                var convertedJson = [],
                    key = 0,
                    check;

                for (var g = 0; g < jsonObj.length; g++) {         
                    for (var i = 0; i < mappings[0].mappingInfo.length; i++) {
                        var obj={};
                        if(!convertedJson[key])
                                convertedJson[key] = {};
                        if(mappings[0].mappingInfo[i].userFieldName){
                            convertedJson[key][mappings[0].mappingInfo[i].userFieldName] = 
                                jsonObj[g][mappings[0].mappingInfo[i].userFieldName];
                        } 
                        else {
                            for (var j = 0; j < mappings[0].mappingInfo[i].values.length; j++) {                 
                                switch(mappings[0].mappingInfo[i].field) {
                                    case "attributeValues":
                                        if(!convertedJson[key].attributeValues)
                                            convertedJson[key].attributeValues = [];
                                            check = checkAlDuplicate(mappings[0].mappingInfo[i].values[j].userFieldName.split('\r')[0], convertedJson[key].attributeValues);
                                            if(check != false) {
                                                convertedJson[key].attributeValues.push({
                                                    "attributeId": mappings[0].mappingInfo[i].values[j].userFieldName.split('\r')[0],
                                                    "attributeValue": jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName.split('\r')[0]]
                                                });
                                            }                                                                             
                                        break;
                                    case "prices":
                                        if(!convertedJson[key].prices)
                                            convertedJson[key].prices = [];
                                            check = checkPDuplicate(mappings[0].mappingInfo[i].values[j].userFieldName.split('_')[0], convertedJson[key].prices);
                                            if(check != false) {
                                                convertedJson[key].prices.push({
                                                    "pricetype": mappings[0].mappingInfo[i].values[j].userFieldName.split('_')[0],
                                                    "price": jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName]
                                                });
                                            }
                                        break;
                                    case "productRelations":
                                        if(!convertedJson[key].productRelations)
                                            convertedJson[key].productRelations = [];

                                        obj[mappings[0].mappingInfo[i].values[j].userFieldName] = 
                                        jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName];
                                        convertedJson[key].productRelations.push(obj);

                                        break;    
                                    case "contractedProducts":
                                        if(!convertedJson[key].contractedProducts)
                                            convertedJson[key].contractedProducts = [];

                                        obj[mappings[0].mappingInfo[i].values[j].userFieldName] = 
                                        jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName];
                                        convertedJson[key].contractedProducts.push(obj);
                                        break;
                                    case "classificationGroupAssociations":
                                        if(!convertedJson[key].classificationGroupAssociations)
                                            convertedJson[key].classificationGroupAssociations = [];
                                        
                                        obj[mappings[0].mappingInfo[i].values[j].userFieldName] = 
                                        jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName];
                                        convertedJson[key].classificationGroupAssociations.push(obj);
                                        break;

                                }  
                            }
                        }
                    };
                    key++;

                };  
                
                reply(convertedJson);
                });
                fileStream.pipe(csvConverter);
    	   } else {
    	        reply(Boom.forbidden(err));
    	   }
    	});
    }
}

//checking duplicates
var checkAlDuplicate = function (name, arr) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].attributeId == name) 
            return false;
    };
}
var checkPDuplicate = function (name, arr) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].pricetype == name) 
            return false;
    };

}
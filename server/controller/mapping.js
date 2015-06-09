var Joi = require('joi'),
    Boom = require('boom'),
    fs = require('fs'),
    http = require('http'),
    Config = require('../config/config'),
    Converter = require("csvtojson").core.Converter,
    Mapping = require('../model/mapping').Mapping,
    Transformation = require('../controller/transformation');


exports.getSchema = {
    handler: function (request, reply) {
        //Transformation.getTransformation();
        var options = {
            host: Config.host.ModuleLinkup,
            path: Config.host.getSchema,
            method: 'GET'
        };
        var req = http.request(options, function(res) {
          return reply(res);
        });

        req.on('error', function(e) {
          console.log('problem with request: ' + e.message);
        });
        
        req.end();

    }
};

exports.createMapping = {
    handler: function(request, reply) {
        Mapping.createMapping(request.payload, function(err, mapping) {
            if (!err) {
                reply(mapping);
            } else {
                reply(Boom.forbidden(err));
            }
        });
    }
};

exports.updateMapping = {
    handler: function(request, reply) {
        Mapping.updateMapping(request.params.mappingId, request.payload, function(err, mapping) {
            if (!err) {
                reply(mapping);
            } else {
                reply(Boom.forbidden(err));
            }
        });
    }
};

exports.getMappingList = {
    handler: function(request, reply) {
        Mapping.getMappingList(request.params.tenantId, function(err, mappings) {
            if (!err) {
                reply(mappings);
            } else {
                reply(Boom.forbidden(err));
            }
        });
    }
};

exports.getMappingForEdit = {
    handler: function(request, reply) {
        Mapping.getMappedData(request.params.tenantId, request.params.mappingId, function(err, mappings) {
            if (!err) {
                reply(mappings);
            } else {
                reply(Boom.forbidden(err));
            }
        });
    }
};

exports.getTestMappingData = {
    handler: function(request, reply) {
        Mapping.getMappedData(request.params.tenantId, request.params.mappingId, function(err, mappings) {
            if (!err) {
                var upload_path = 'upload/' + mappings[0].fileName;
                var fileStream = fs.createReadStream(upload_path);
                //new converter instance 
                var csvConverter = new Converter({
                    constructResult: true
                });

                //end_parsed will be emitted once parsing finished 
                csvConverter.on("end_parsed", function(jsonObj) {
                    var finalJson = [];
                    for (var i = 0; i < jsonObj.length; i++) {
                        var temp = {};

                        //this condition is only if it's product schema and can be toggled/turned off from config/config
                        if(Config.host.isProductSchema){
                            temp[mappings[0].mappingInfo[0].field] = Transformation.getTransformation(mappings[0].mappingInfo[0].transformations, "1");
                        }
                        for (var key in jsonObj[i]){                       
                            for (var j = 0; j < mappings[0].mappingInfo.length; j++) {
                                if(mappings[0].mappingInfo[j].userFieldName == undefined){
                                    if(temp[mappings[0].mappingInfo[j].field] == undefined) temp[mappings[0].mappingInfo[j].field] = [];
                                    for (var k = 0; k < mappings[0].mappingInfo[j].values.length; k++){
                                        for (var l = 0; l < mappings[0].mappingInfo[j].values[k].fields.length; l++){
                                            if(mappings[0].mappingInfo[j].values[k].fields[l].userFieldName == 'defaultValue'){
                                                if(temp[mappings[0].mappingInfo[j].field][k] == undefined) {
                                                    temp[mappings[0].mappingInfo[j].field][k] = {};
                                                }
                                                var field = mappings[0].mappingInfo[j].values[k].fields[l].field;
                                                temp[mappings[0].mappingInfo[j].field][k][field] = Transformation.getTransformation(mappings[0].mappingInfo[j].values[k].fields[l].transformations, mappings[0].mappingInfo[j].values[k].fields[l].defaultValue);
                                            }
                                            else{
                                                if(key == mappings[0].mappingInfo[j].values[k].fields[l].userFieldName){
                                                    if(temp[mappings[0].mappingInfo[j].field][k] == undefined) {
                                                        temp[mappings[0].mappingInfo[j].field][k] = {};
                                                    }
                                                    var field = mappings[0].mappingInfo[j].values[k].fields[l].field;
                                                    temp[mappings[0].mappingInfo[j].field][k][field] = Transformation.getTransformation(mappings[0].mappingInfo[j].values[k].fields[l].transformations,jsonObj[i][key]);                                         
                                                }
                                                else if(mappings[0].mappingInfo[j].defaultValue != null){
                                                    temp[mappings[0].mappingInfo[j].field] = Transformation.getTransformation(mappings[0].mappingInfo[j].fields[l].transformations, mappings[0].mappingInfo[j].fields[l].defaultValue);    
                                                }
                                            }
                                        }
                                    }
                                }
                                else if(key == mappings[0].mappingInfo[j].userFieldName){                                    
                                    temp[mappings[0].mappingInfo[j].field] = Transformation.getTransformation(mappings[0].mappingInfo[j].transformations, jsonObj[i][key]);
                                }
                                else if(mappings[0].mappingInfo[j].defaultValue != null){
                                    temp[mappings[0].mappingInfo[j].field] = Transformation.getTransformation(mappings[0].mappingInfo[j].transformations, mappings[0].mappingInfo[j].defaultValue);
                                }
                            }
                        }
                        finalJson.push(temp);                  
                    }
                    reply(finalJson);
                });
                fileStream.pipe(csvConverter);
            } else {
                reply(Boom.forbidden(err));
            }
        });
    }
};

// exports.getMappingData = {
//     handler: function(request, reply) {
//         Mapping.getMappedData(request.params.tenantId, request.params.mappingId, function(err, mappings) {
//             if (!err) {
//                 var upload_path = 'upload/' + mappings[0].fileName;
//                 var fileStream = fs.createReadStream(upload_path);
//                 //new converter instance 
//                 var csvConverter = new Converter({
//                     constructResult: true
//                 });

//                 //end_parsed will be emitted once parsing finished 
//                 csvConverter.on("end_parsed", function(jsonObj) {
//                     var convertedJson = [],
//                         key = 0,
//                         check;
//                     for (var g = 0; g < jsonObj.length; g++) {
//                         for (var i = 0; i < mappings[0].mappingInfo.length; i++) {
//                             var obj = {};
//                             if (!convertedJson[key])
//                                 convertedJson[key] = {};

//                             if (mappings[0].mappingInfo[i].userFieldName) {
//                                 if(mappings[0].mappingInfo[i].defaultValue != undefined) {
//                                     convertedJson[key][mappings[0].mappingInfo[i].userFieldName] = 
//                                     mappings[0].mappingInfo[i].defaultValue;
//                                 } else {
//                                     convertedJson[key][mappings[0].mappingInfo[i].userFieldName] =
//                                     changeFormat(jsonObj[g][mappings[0].mappingInfo[i].userFieldName], mappings[0].delimeter);
//                                 }
//                             } else {
//                                 for (var j = 0; j < mappings[0].mappingInfo[i].values.length; j++) {
//                                     switch (mappings[0].mappingInfo[i].field) {
//                                         case "attributeValues":
//                                             if (!convertedJson[key].attributeValues)
//                                                 convertedJson[key].attributeValues = [];
//                                             check = checkAlDuplicate(mappings[0].mappingInfo[i].values[j].userFieldName, convertedJson[key].attributeValues);
//                                             if (check != false) {
//                                                 if(mappings[0].mappingInfo[i].values[j].defaultValue) {
//                                                     obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                             mappings[0].mappingInfo[i].values[j].defaultValue;
//                                                     convertedJson[key].attributeValues.push(obj);
//                                                 } else {
//                                                     convertedJson[key].attributeValues.push({
//                                                         "attributeId": mappings[0].mappingInfo[i].values[j].userFieldName,
//                                                         "attributeValue":changeFormat(jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName], mappings[0].delimeter)
//                                                     });
//                                                 }
//                                             }
//                                             break;

//                                         case "prices":
//                                             if (!convertedJson[key].prices)
//                                                 convertedJson[key].prices = [];
//                                             check = checkPDuplicate(mappings[0].mappingInfo[i].values[j].userFieldName.split('_')[0], convertedJson[key].prices);
//                                             if (check != false) {
//                                                 if(mappings[0].mappingInfo[i].values[j].userFieldName == "gross_price" ||
//                                                     mappings[0].mappingInfo[i].values[j].userFieldName == "retail_price" || 
//                                                     mappings[0].mappingInfo[i].values[j].userFieldName == "grossprice" || 
//                                                     mappings[0].mappingInfo[i].values[j].userFieldName == "retailprice") {
//                                                         convertedJson[key].prices.push({
//                                                          "pricetype": mappings[0].mappingInfo[i].values[j].userFieldName.split('_')[0],
//                                                          "price": jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName]
//                                                         });
//                                                 } 
//                                                 else { 
//                                                     if(mappings[0].mappingInfo[i].values[j].defaultValue) {
//                                                          obj[mappings[0].mappingInfo[i].values[j].userFieldName] = mappings[0].mappingInfo[i].values[j].defaultValue
//                                                     } else {
//                                                         obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                             changeFormat(jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName], mappings[0].delimeter);
//                                                     } 
//                                                     convertedJson[key].prices.push(obj);
//                                                 }     
//                                             }
//                                             break;

//                                         case "productRelations":
//                                             if (!convertedJson[key].productRelations)
//                                                 convertedJson[key].productRelations = [];
//                                             if(mappings[0].mappingInfo[i].values[j].defaultValue) {
//                                                 obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                 mappings[0].mappingInfo[i].values[j].defaultValue;
//                                             } else {
//                                                 obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                 changeFormat(jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName], mappings[0].delimeter);
//                                             }
//                                             convertedJson[key].productRelations.push(obj);
//                                             break;

//                                         case "contractedProducts":
//                                             if (!convertedJson[key].contractedProducts)
//                                                 convertedJson[key].contractedProducts = [];

//                                             if(mappings[0].mappingInfo[i].values[j].defaultValue){
//                                                 obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                 mappings[0].mappingInfo[i].values[j].defaultValue;
//                                             }else{
//                                                 obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                 changeFormat(jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName], mappings[0].delimeter);
//                                             }
//                                             convertedJson[key].contractedProducts.push(obj);
//                                             break;

//                                         case "classificationGroupAssociations":
//                                             if (!convertedJson[key].classificationGroupAssociations)
//                                                 convertedJson[key].classificationGroupAssociations = [];
//                                             if(mappings[0].mappingInfo[i].values[j].defaultValue) {
//                                                 obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                 mappings[0].mappingInfo[i].values[j].defaultValue;
//                                             } else {
//                                                 obj[mappings[0].mappingInfo[i].values[j].userFieldName] =
//                                                     changeFormat(jsonObj[g][mappings[0].mappingInfo[i].values[j].userFieldName], mappings[0].delimeter);
//                                             }
//                                             convertedJson[key].classificationGroupAssociations.push(obj);
//                                             break;

//                                     }
//                                 }
//                             }
//                         };
//                         key++;
//                     };
//                      reply(convertedJson);
//                 });
//                 fileStream.pipe(csvConverter);
//             } else {
//                 reply(Boom.forbidden(err));
//             }
//         });
//     }
// }


//format change
var changeFormat = function (item, format){
    var list;
    if(isNaN(item)) { 
        var d = new Date(item);
        if(d != "Invalid Date"){
          var date = d.getDate();
          if(date < 10) date = "0"+date;
          var month = d.getMonth()+1;
          if(month < 10) month = "0"+month;
          var year = d.getFullYear();
          if(format.dateFormat == "MM/dd/yyyy") {
            item = month+"/"+date+"/"+year;
          }  
          else
            item = date+"-"+month+"-"+year;
        }
    }

    if(!isNaN(item)) {
      if(format.numberFormat == '#,##'){
        var str = item.slice(0, -2)+','+item.slice(-2);
        item = str;
      }
      else if(format.numberFormat == '#.##'){
        list = (item / 100);
      }
      else if(format.numberFormat == '#,###.##'){
        if(item.toString().length > 5){
          item = (item / 100);
          var str = item.toString().split('.');
          if (str[0].length >= 4) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
          }
          if (str[1] && str[1].length >= 4) {
              str[1] = str[1].replace(/(\d{3})/g, '$1 ');
          }
          item = str.join('.');
        }
      }
      else if(format.numberFormat == '#.###,##'){
        var str = item.toString();
        if(str.length > 5){
          str = list[i].slice(0, -5)+'.'+item.slice(-3)+','+item.slice(-2);
          item = str;  
        }
      }
    }
    
 return item;
};

//checking duplicates
var checkAlDuplicate = function(name, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].attributeId == name)
            return false;
    }
};
var checkPDuplicate = function(name, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].pricetype == name)
            return false;
    }

};

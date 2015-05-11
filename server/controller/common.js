var Joi = require('joi'),
    Boom = require('boom'),
    Product = require('../model/product').Product;

exports.getAll = {
  handler: function (request, reply) {
    var obj = {};
        obj['modelName'] = Product.modelName;
        obj['subdocument'] = [];
        obj['attributes'] = [];
    var schemaPath = Product.schema.paths;

    for (var path in schemaPath){
      if(path === '_id' || path === '__v' || path === 'createdBy' || path === 'updatedBy' || path === 'updatedAt' || path === 'createdAt') continue;

      var data = {};
      data.field = path;    

      if(schemaPath[path].schema != undefined){
       obj['subdocument'].push(path);
        data.values = [];
        for (var path1 in schemaPath[path].schema.paths){
            if(path1 === '_id' || path1 === '__v' || path1 === 'createdBy' || path1 === 'updatedBy' || path1 === 'updatedAt' || path1 === 'createdAt') continue;
              var data1 = {};
              data1.field = schemaPath[path].schema.paths[path1].path;
              data1.index = schemaPath[path].schema.paths[path1]._index;
              data1.instance = schemaPath[path].schema.paths[path1].instance;
              data.values.push(data1);
        }
      }
      else{
        data.index = schemaPath[path]._index;
        data.isRequired = schemaPath[path].isRequired;
        data.instance = schemaPath[path].instance;
      }

      obj['attributes'].push(data);
      
    }
      reply(obj);
  }
};

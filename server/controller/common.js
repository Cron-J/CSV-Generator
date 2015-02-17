var Joi = require('joi'),
    Boom = require('boom'),
    Product = require('../model/product').Product,
    Price = require('../model/price').Price,
    ProductAttributeValue = require('../model/product-attribute-value').ProductAttributeValue,
    ProductRelation = require('../model/product-relation').ProductRelation,
    ContractedProduct = require('../model/contracted-product').ContractedProduct,
    ProductDocAssociation = require('../model/product-doc-association').ProductDocAssociation,
    Product2ClassificationGroup = require('../model/product-classification-group').Product2ClassificationGroup;


exports.getAll = {
  handler: function (request, reply) {
    var collectionName = request.params.table ;
    var obj = {};
    var schemaPath;
    var collectionName;

    switch (collectionName) {
      case 'Product':
            collectionName = "Product";
            schemaPath = Product.schema.paths;
            break;
      case 'Prices':
            collectionName = "Price";
            schemaPath = Price.schema.paths;
            break;
      case 'ProductAttributeValues':
            collectionName = "ProductAttributeValue";
            schemaPath = ProductAttributeValue.schema.paths;
            break;
      case 'ProductRelations':
            collectionName = "ProductRelation";
            schemaPath = ProductRelation.schema.paths;
            break;
      case 'ContractedProduct':
            collectionName = "ContractedProduct";
            schemaPath = ContractedProduct.schema.paths;
            break;
      case 'Product2ClassificationGroup':
            collectionName = "Product2ClassificationGroup";
            schemaPath = Product2ClassificationGroup.schema.paths;
            break;
    }

    obj[collectionName] = []
    for (var path in schemaPath){
      if(path === '_id' || path === '__v') continue;

      var data = {};
      data.field = path;
      data.index = schemaPath[path]._index;
      data.reference = {};
      if(schemaPath[path].options.ref != undefined) data.reference.ref = schemaPath[path].options.ref
      if(schemaPath[path].instance != undefined) data.instance = schemaPath[path].instance
      if(schemaPath[path].caster != undefined){
        data.instance = schemaPath[path].caster.instance;
        data.reference.ref = schemaPath[path].caster.options.ref;
        data.reference.isArray = "true";
      }
      obj[collectionName].push(data);
      
    }
      reply(obj);
  }
};


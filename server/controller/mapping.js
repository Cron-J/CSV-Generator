var Joi = require('joi'),
    Boom = require('boom'),
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
	            reply(mappings);
	        } else {
	             reply(Boom.forbidden(err));
	        }
    	});
    }
}
var Joi = require('joi'),
    Boom = require('boom'),
    Mapping = require('../model/mapping').Mapping;

exports.createMapping = {
    handler: function(request, reply) {
    	var mapping = new Mapping(request.payload);
	    mapping.save(function(err, mapping) {
	        if (!err) {
	            reply(mapping);
	        } else {
	             reply(Boom.forbidden(err));
	        }
	    });
    }
}
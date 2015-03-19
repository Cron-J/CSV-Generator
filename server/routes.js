// Load modules

var Common     = require('./controller/common'),
	Mapping = require('./controller/mapping'),
    Static    = require('./static');

// API Server Endpoints
exports.endpoints = [

    { method: 'GET',  path: '/{somethingss*}', config: Static.get },
    { method: 'GET', path: '/getAttributes', config: Common.getAll },
    { method: 'GET', path: '/getMappingList/{tenantId}', config: Mapping.getMappingList },
    { method: 'GET', path: '/getMappingData/{tenantId}/{mappingId}', config: Mapping.getMappingData },
    { method: 'POST', path: '/createMapping', config: Mapping.createMapping }
];
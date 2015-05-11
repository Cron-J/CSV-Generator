// Load modules

var Common     = require('./controller/common'),
	Mapping = require('./controller/mapping'),
	File = require('./controller/file'),
  	Static    = require('./static');

// API Server Endpoints
exports.endpoints = [

    { method: 'GET',  path: '/{somethingss*}', config: Static.get },
    { method: 'POST', path: '/uploadedFileData', config: File.uploadFile },
    { method: 'GET', path: '/getAttributes', config: Common.getAll },
    { method: 'GET', path: '/getMappingList/{tenantId}', config: Mapping.getMappingList },
    { method: 'GET', path: '/getTestMappingData/{tenantId}/{mappingId}', config: Mapping.getTestMappingData },
    { method: 'GET', path: '/getMappingData/{tenantId}/{mappingId}', config: Mapping.getMappingData },
    { method: 'PUT', path: '/updateMapping/{mappingId}', config: Mapping.updateMapping },
    { method: 'GET', path: '/getMapping/{tenantId}/{mappingId}', config: Mapping.getMappingForEdit },
    { method: 'POST', path: '/createMapping', config: Mapping.createMapping }
];
// Load modules

var Common     = require('./controller/common'),
	Mapping = require('./controller/mapping'),
    Static    = require('./static');

// API Server Endpoints
exports.endpoints = [

    { method: 'GET',  path: '/{somethingss*}', config: Static.get },
    { method: 'GET', path: '/getAttributes/{table}', config: Common.getAll },
    { method: 'POST', path: '/createMapping', config: Mapping.createMapping }
];
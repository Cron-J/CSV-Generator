// Load modules

var Common     = require('./controller/common'),
    Static    = require('./static');

// API Server Endpoints
exports.endpoints = [

    { method: 'GET',  path: '/{somethingss*}', config: Static.get },
    { method: 'GET', path: '/getAttributes/{table}', config: Common.getAll}
];
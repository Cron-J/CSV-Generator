var Joi = require('joi'),
    formidable = require('formidable'),
    Boom = require('boom'),
    Mapping = require('../model/mapping').Mapping,
    Converter = require("csvtojson").core.Converter,
    hostFromConfig = require('../config/config').host,
    fs = require('fs');

exports.getHostFromConfig = {
    handler: function(request, reply) {
        return reply(hostFromConfig.ModuleLinkup);
    }
};

exports.uploadFile = {
    validate: {
        payload: {
            file: Joi.object().optional(),
            file_name: Joi.string().required()
        }
    },
    handler: function(request, reply) {
        console.log('============uploaded file=========',request.payload.file);
        var data = request.payload.file;
        if (data.length === undefined) {
            reply(Boom.forbidden('Please Upload the file'));
        } else {
            var path = 'upload';

            fs.mkdir(path, function(e) {
                if (!e || (e && e.code === 'EEXIST')) {
                    var fileName = request.payload.file_name + new Date().getTime();
                    var upload_path = path + '/' + request.payload.file_name + new Date().getTime();
                    fs.writeFileSync(upload_path, data);
                    fs.readFile(upload_path, 'utf8', function(err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        reply(csvJSON(data, fileName));
                    });
                } else {
                    //debug
                    reply(Boom.forbidden(err));
                }
            });

        }
    }
};

exports.getMappingCSVData = {
    handler: function(request, reply) {
        Mapping.getMappedData(request.params.tenantId, request.params.mappingId, function(err, mappings) {
            if (!err) {
                var path = 'upload';
                var upload_path = path + '/' + mappings[0].fileName;

                fs.readFile(upload_path, 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    reply(csvJSON(data, mappings[0].fileName));
                });
            }
            else {
                reply(Boom.forbidden(err));
            }
        });
    }
};

function csvJSON(csv, fileName) {
    var lines = csv.split("\n");
    var result = {};
    result.fileName = fileName;
    if(lines[0])
        result.headers = lines[0].split("\r")[0]
    if(lines[1])
        result.rowOne = lines[1].split("\r")[0]
    if(lines[2])
        result.rowTwo = lines[2].split("\r")[0]

    return JSON.stringify(result); //JSON
}
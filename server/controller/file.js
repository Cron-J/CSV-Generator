var Joi = require('joi'),
    formidable = require('formidable'),
    Boom = require('boom'),
    Converter = require("csvtojson").core.Converter,
    fs = require('fs');

exports.uploadFile = {
    validate: {
        payload: {
            file: Joi.object().optional(),
            file_name: Joi.string().required()
        }
    },
    handler: function(request, reply) {
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
                    console.log('------------------', e);
                }
            });

        }
    }
};

function csvJSON(csv, fileName) {

    var lines = csv.split("\n");
    var result = {};
    result.fileName = fileName;
    if(lines[0])
        result.headers = lines[0].split("\r")[0].split(",")
    if(lines[1])
        result.rowOne = lines[1].split("\r")[0].split(",")
    if(lines[2])
        result.rowTwo = lines[2].split("\r")[0].split(",")

    return JSON.stringify(result); //JSON
}
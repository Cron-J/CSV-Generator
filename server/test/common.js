'use strict';

var Mongoose = require('mongoose'), 
    Config = require('../config/config'),
    request = require('supertest'),
    db;

describe('mapping controller test', function() {
    before(function(done) {
        Mongoose.connect('mongodb://' + Config.database.host + '/' + Config.database.db);
        db = Mongoose.connection;
        db.on('error', console.error.bind(console, 'DB connection error'));
        db.once('open', function callback() {
            done();
        });
    });

    after(function(done) {
        Mongoose.connection.close(done);
    });
    
    describe('successfully get schema', function() {
        it('get all fields of schema', function(done) {
            var url = Config.server.host +':'+ Config.server.port;
            request(url)
            .get('/getAttributes')
            .expect(200)
            .end(function(err) {
              if (err) {
                throw err;
              }
              done();
            });
        });
    });
});
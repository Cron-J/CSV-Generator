'use strict';

var Mongoose = require('mongoose'), 
    Config = require('../config/config'),
    request = require('supertest'),
    testCommon = require('./commonHelper'),
    url = Config.server.host +':'+ Config.server.port,
    db;

describe('mapping controller test', function () {
    before( function(done) {
        Mongoose.connect('mongodb://' + Config.database.host + '/' + Config.database.db);
        db = Mongoose.connection;
        db.on('error', console.error.bind(console, 'DB connection error'));
        db.once('open', function callback() {
            done();
        });
    });
    
    beforeEach( function(done) {
        testCommon.removeCollections(Mongoose, function (err) {
            if (err) {
                throw err;
            }
            done();
        });
    });

    after( function(done) {
        Mongoose.connection.close(done);
    });

    describe('create mapping', function () {
        it('successfully create', function (done) {
            var  Mapping= {
                tenantId: '1',
                mappingName: 'first_mapping',
                fileName: 'first_mapping'
            };
            request(url)
            .post('/createMapping')
            .send(Mapping)
            .expect(200)
            .end(function(err) {
              if (err) {
                throw err;
              }
              done();
            });
        });

        it('create mapping without tenant id', function (done) {
            var  Mapping= {
                mappingName: 'first_mapping',
                fileName: 'first_mapping'
            };
            request(url)
            .post('/createMapping')
            .send(Mapping)
            .expect(403)
            .end(function(err) {
              if (err) {
                throw err;
              }
              done();
            });
        });

        it('create mapping without mapping name', function (done) {
            var  Mapping= {
                tenantId: '1',
                fileName: 'first_mapping'
            };
            request(url)
            .post('/createMapping')
            .send(Mapping)
            .expect(403)
            .end(function(err) {
              if (err) {
                throw err;
              }
              done();
            });
        });

         it('create mapping without file name', function (done) {
            var  Mapping= {
                tenantId: '1',
                mappingName: 'first_mapping'
            };
            request(url)
            .post('/createMapping')
            .send(Mapping)
            .expect(403)
            .end(function(err) {
              if (err) {
                throw err;
              }
              done();
            });
        });
    });

    describe('get mapping list', function() {
        it('successfully get mapping list based on tenant id', function(done) {
            var  Mapping= {
                tenantId: '1',
                mappingName: 'first_mapping',
                fileName: 'first_mapping'
            },
            getmappingList = function (tenant) {
                request(url)
                .get('/getMappingList/'+tenant)
                .expect(200)
                .end(function(err) {
                  if (err) {
                    throw err;
                  }
                  done();
                });
            };
            request(url)
            .post('/createMapping')
            .send(Mapping)
            .expect(200)
            .end(function(err) {
              if (err) {
                throw err;
              }
              getmappingList(Mapping.tenantId);
            });
        });

        it('get mapping list without tenant id', function(done) {
            var  Mapping= {
                tenantId: '1',
                mappingName: 'first_mapping',
                fileName: 'first_mapping'
            },
            getmappingList = function () {
                request(url)
                .get('/getMappingList')
                .expect(404)
                .end(function(err) {
                  if (err) {
                    throw err;
                  }
                  done();
                });
            };
            request(url)
            .post('/createMapping')
            .send(Mapping)
            .expect(200)
            .end(function(err) {
              if (err) {
                throw err;
              }
              getmappingList();
            });
        });
    });
});
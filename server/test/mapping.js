var assert = require('chai').assert;
var Mongoose = require("mongoose");
var Config = require("../config/config");
var request = require("supertest");
var testCommon = require("./commonHelper");
/** @type {string} */
var url = Config.server.host + ":" + Config.server.port;
var db;

describe("mapping controller test", function() {
  before(function(ready) {
    Mongoose.connect("mongodb://" + Config.database.host + "/" + Config.database.db);
    db = Mongoose.connection;
    db.on("error", console.error.bind(console, "DB connection error"));
    db.once("open", function completed() {
      ready();
    });
  });

  beforeEach(function(done) {
    testCommon.removeCollections(Mongoose, function(error) {
      if (error) {
        throw error;
      }
      done();
    });
  });

  after(function(res) {
    Mongoose.connection.close(res);
  });

  describe("create mapping", function() {

    it("successfully create", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "first_mapping"
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it("create mapping without tenant id", function(done) {
      var validCredentials = {
        mappingName : "first_mapping",
        fileName : "first_mapping"
      };
      request(url).post("/createMapping").send(validCredentials).expect(403).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it("create mapping without mapping name", function(done) {
      var validCredentials = {
        tenantId : "1",
        fileName : "first_mapping"
      };
      request(url).post("/createMapping").send(validCredentials).expect(403).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it("create mapping without file name", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping"
      };
      request(url).post("/createMapping").send(validCredentials).expect(403).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

  });
  describe("get mapping list", function() {

    it("successfully get mapping list based on tenant id", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "first_mapping"
      };
      /**
       * @param {string} method_name
       * @return {undefined}
       */
      var getMappingList = function(method_name) {
        request(url).get("/getMappingList/" + method_name).expect(200).end(function(error) {
          if (error) {
            throw error;
          }
          done();
        });
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error, result) {
        if (error) {
          throw error;
        }
        getMappingList(result.body.tenantId);
      });
    });

    it("get mapping list without tenant id", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "first_mapping"
      };
      /**
       * @return {undefined}
       */
      var getMappingList = function() {
        request(url).get("/getMappingList").expect(404).end(function(error) {
          if (error) {
            throw error;
          }
          done();
        });
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error) {
        if (error) {
          throw error;
        }
        getMappingList();
      });
    });

    it("get mapping list based on non existing tenant id", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "first_mapping"
      };
      /**
       * @param {string} options
       * @return {undefined}
       */
      var getMappingList = function(options) {
        request(url).get("/getMappingList/" + options).expect(200).end(function(error) {
          if (error) {
            throw error;
          }
          done();
        });
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error, deeperror) {
        if (error) {
          throw error;
        }
        getMappingList("undefined");
      });
    });

  });

  describe("get mapping data", function() {

    it("successfully get mapping data based on tenant id and mapping id", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "CatalogProductTemplate"
      };
      /**
       * @param {string} event
       * @param {string} num
       * @return {undefined}
       */
      var getMappingData = function(event, num) {
        request(url).get("/getMappingData/" + event + "/" + num).expect(500).end(function(error) {
          if (error) {
            throw error;
          }
          done();
        });
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error, result) {
        if (error) {
          throw error;
        }
        getMappingData(result.body.tenantId, result.body._id);
      });
    });

    it("get mapping data based on tenant id only", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "CatalogProductTemplate"
      };
      /**
       * @param {string} method_name
       * @return {undefined}
       */
      var getMappingData = function(method_name) {
        request(url).get("/getMappingData/" + method_name).expect(404).end(function(error) {
          if (error) {
            throw error;
          }
          done();
        });
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error, result) {
        if (error) {
          throw error;
        }
        getMappingData(result.body.tenantId);
      });
    });

    it("get mapping data based on mapping id only", function(done) {
      var validCredentials = {
        tenantId : "1",
        mappingName : "first_mapping",
        fileName : "CatalogProductTemplate"
      };
      /**
       * @param {string} method_name
       * @return {undefined}
       */
      var getMappingData = function(method_name) {
        request(url).get("/getMappingData/" + method_name).expect(404).end(function(error) {
          if (error) {
            throw error;
          }
          done();
        });
      };
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error, result) {
        if (error) {
          throw error;
        }
        getMappingData(result.body._id);
      });
    });
    
  });
});
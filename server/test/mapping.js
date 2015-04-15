var Mongoose = require("mongoose"),
    Db = require('../config/db'),
    Config = require("../config/config"),
    request = require("supertest"),
    testCommon = require("./commonHelper"),
    url = Config.server.host + ":" + Config.server.port;


describe("mapping controller test", function() {
  beforeEach(function(done) {
    testCommon.removeCollections(Mongoose, function(error) {
      if (error) {
        throw error;
      }
      done();
    });
  });


  describe("create mapping", function() {

    it("successfully create", function(done) {
      var validCredentials = testCommon.successData();
      request(url).post("/createMapping").send(validCredentials).expect(200).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it("create mapping without tenant id", function(done) {
      var validCredentials = testCommon.dataWithoutTenant();
      request(url).post("/createMapping").send(validCredentials).expect(403).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it("create mapping without mapping name", function(done) {
      var validCredentials = testCommon.dataWithoutMapping();
      request(url).post("/createMapping").send(validCredentials).expect(403).end(function(error) {
        if (error) {
          throw error;
        }
        done();
      });
    });

    it("create mapping without file name", function(done) {
      var validCredentials = testCommon.dataWithoutFileName();
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
      var validCredentials = testCommon.successData();
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
      var validCredentials = testCommon.successData();
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
      var validCredentials = testCommon.successData();
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
      var validCredentials = testCommon.successData();
      /**
       * @param {string} event
       * @param {string} num
       * @return {undefined}
       */
      var getMappingData = function(event, num) {
        request(url).get("/getMappingData/" + event + "/" + num).expect(200).end(function(error) {
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
      var validCredentials = testCommon.successData();
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
      var validCredentials = testCommon.successData();
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
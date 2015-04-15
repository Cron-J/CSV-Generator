var Mongoose = require("mongoose"),
    Config = require("../config/config"),
    request = require("supertest"),
    db;

describe("mapping controller test", function() {
 
  describe("successfully get schema", function() {
    it("get all fields of schema", function(done) {
      /** @type {string} */
      var url = Config.server.host + ":" + Config.server.port;
      request(url).get("/getAttributes").expect(200).end(function(dataAndEvents) {
        if (dataAndEvents) {
          throw dataAndEvents;
        }
        done();
      });
    });
  });
  
});

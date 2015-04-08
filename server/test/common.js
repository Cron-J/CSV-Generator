var Mongoose = require("mongoose");
var Config = require("../config/config");
var request = require("supertest");
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

  after(function(res) {
    Mongoose.connection.close(res);
  });

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

'use strict';

describe('Upload page', function() {
  var helper;
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    this.title = browser.getTitle();
    helper = require('../helper.js');
    browser.get('http://localhost:8000/#/');
    browser.sleep(500);
  });

  afterEach(function() {
    browser.sleep(500);
  })
  describe('able to', function() {
    it('upload csv file', function(){   
      helper.uploadFile('C:/Users/Cronj-4/Desktop/demo.csv');
      browser.sleep(200);
      element.all(by.css('.sel-file span')).then(function(items) {
        expect(items[1].getText()).toContain('Uploaded File:');
      });
      browser.sleep(200);
    });
    it('reject non csv file', function(){   
      helper.uploadFile('C:/Users/Cronj-4/Desktop/error.png');
      browser.sleep(200);
      element.all(by.css('.response span')).then(function(items) {
        expect(items[0].getText()).toContain('Rejected File:');
      });
      browser.sleep(200);
    });

  });
});
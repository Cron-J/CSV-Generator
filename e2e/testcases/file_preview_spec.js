'use strict';

describe('File preview page', function() {  
  var helper;
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    this.title = browser.getTitle();
    helper = require('../helper.js');
    browser.get('http://localhost:8000/#/');
    browser.sleep(500);
    helper.uploadFile('C:/Users/Cronj-4/Desktop/demo.csv');
    browser.sleep(200);
    element.all(by.buttonText('Next')).then(function(items) {
      items[0].click();
    });
    browser.sleep(500);
  });

  afterEach(function() {
    browser.sleep(500);
  });
  describe('when', function() {
    describe("first line include header", function() {
      it('is checked then show header in table', function(){     
        element.all(by.css('.table thead')).then(function(rows) {
          expect(rows[0].isDisplayed()).toBe(true);
        });
      });

      it('is unchecked then hide header in table', function(){     
        var checkbox = element(by.css('input[type="checkbox"]'));
        checkbox.click();
        browser.sleep(200);
        element.all(by.css('.table thead')).then(function(rows) {
          expect(rows[0].isDisplayed()).toBe(false);
        });
      });

    });

    describe('change related columns data if format of', function() {
      afterEach(function() {
        browser.sleep(500);
      });

      it('data is changed', function(){   
        element(by.id('date')).click();
        browser.sleep(300);
        element.all(by.css('select option')).then(function(items) {
          items[2].click();
        });
        element(by.id('date')).click();
        browser.sleep(200);
        element.all(by.repeater('uploadedData.rowOne')).then(function(items) {
          expect(items[2].getText()).toBe('10/03/2014');
        });
        element.all(by.repeater('uploadedData.rowTwo')).then(function(items) {
          expect(items[2].getText()).toBe('11/03/2014');
        });
      });

      it('number is changed', function(){   
        element(by.id('number')).click();
        browser.sleep(300);
        element.all(by.css('select option')).then(function(items) {
          items[4].click();
        });
        element(by.id('number')).click();
        browser.sleep(200);
        element.all(by.repeater('uploadedData.rowOne')).then(function(items) {
          expect(items[5].getText()).toBe('242,001.02');
        });
        element.all(by.repeater('uploadedData.rowTwo')).then(function(items) {
          expect(items[5].getText()).toBe('242,001.02');
        });
      });

    });

    describe('change row data view if ', function() {
      it('delimiter format is changed', function(){   
        element(by.id('delimiter')).click();
        browser.sleep(300);
        element.all(by.css('select option')).then(function(items) {
          items[8].click();
        });
        element(by.id('delimiter')).click();
        browser.sleep(200);
      });

    });
  });
});
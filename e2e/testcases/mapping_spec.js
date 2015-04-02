'use strict';

describe('Mapping page', function() {  
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
    browser.sleep(200);
    element.all(by.buttonText('Next')).then(function(items) {
      items[1].click();
    });
    browser.sleep(500);
  });

  afterEach(function() {
    browser.sleep(500);
  });

  describe('able to', function() {

    it('map if sufficent details are provided', function(){  
      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[0].click();
      });
      browser.sleep(200);
      element.all(by.id('SelectId option')).then(function(options) { 
        options[0].click();
      });
      browser.sleep(500);
      element.all(by.repeater('propertyList')).then(function(props) { 
        props[2].click();
      });
      browser.sleep(1000);   

      element(by.css('[ng-click="mapping()"]')).click();
      browser.sleep(200);
      // element.all(by.repeater('tableData')).then(function(items) { 
      //   expect(items[0].isDisplayed()).toBe(true);
      // });
    });

    it('show error message if sufficent details are not provided for map', function(){     
      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[1].click();
      });
      browser.sleep(500);
      element.all(by.id('property option')).then(function(props) { 
        props[2].click();
      });
      browser.sleep(500);
      element(by.css('[ng-click="mapping()"]')).click();
      browser.sleep(200);
      element.all(by.css('.growl-message')).then(function(items) {
        expect(items[0].getText()).toContain('Select column, table and property names to map');
      }); 
      browser.sleep(200);
    });

    it('do auto attribute map if column is selected', function(){     
      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[1].click();
      });
      browser.sleep(500);
      element(by.css('[ng-click="mapAttribute()"]')).click();
      browser.sleep(200);
    });

    it('do auto attribute map if column is selected', function(){    
      element(by.css('[ng-click="mapAttribute()"]')).click();
      browser.sleep(200);
      element.all(by.css('.growl-message')).then(function(items) {
        expect(items[0].getText()).toContain('Select column name');
      }); 
      browser.sleep(200);
    });

    it('show error messages if requirements are not fullfilled for save mapping', function(){   
      browser.sleep(200);
      element(by.css('[ng-click="saveMappingStep(map, tableData)"]')).click();
      browser.sleep(200);
      element.all(by.css('.growl-message')).then(function(items) {
        expect(items[0].getText()).toContain('Please provide mapping name before saving');
      }); 
      browser.sleep(200);
      element.all(by.css('[ng-click="growlMessages.deleteMessage(message)"]')).then(function(items) { 
        items[0].click();
      });
      browser.sleep(500);
      element(by.id('mapName')).sendKeys(helper.getRandomString(4) + helper.getRandomString(2));
      browser.sleep(2000);
      element(by.buttonText('Save Mapping')).click();
      element.all(by.css('.growl-message')).then(function(items) {
        expect(items[0].getText()).toContain('There are no mapping details to save');
      }); 
      browser.sleep(200);
      element.all(by.css('[ng-click="growlMessages.deleteMessage(message)"]')).then(function(items) { 
        items[0].click();
      });
      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[1].click();
      });
      browser.sleep(300);
      element(by.css('[ng-click="mapAttribute()"]')).click();
      browser.sleep(200);
      element(by.buttonText('Save Mapping')).click();
      browser.sleep(200);
      element.all(by.css('.growl-message')).then(function(items) {
        expect(items[0].getText()).toContain('Please map all required fields before trying to save mapping');
      }); 
      browser.sleep(200);
    });

    iit('save mapping if sufficent details are present', function(){   
      element(by.id('subTableList')).click();
 
       browser.sleep(200);
      element.all(by.css('.dropdown-menu li')).then(function(items) {
        items[0].click();
      }); 
       browser.sleep(200);
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
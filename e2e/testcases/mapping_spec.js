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
      helper.mapFunction(); 
      element.all(by.repeater('tableData')).then(function(items) { 
        expect(items[0].isDisplayed()).toBe(true);
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

    it('save mapping if sufficent details are present', function(){  
      //map
      helper.mapFunction(); 
      //map attribute
      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[3].click();
      });
      element(by.css('[ng-click="mapAttribute()"]')).click();
      browser.sleep(200);
      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[5].click();
      });
      element(by.css('[ng-click="mapAttribute()"]')).click();
      browser.sleep(200);

      element.all(by.repeater('columnShowList')).then(function(listItems) { 
        listItems[5].click();
      });
      element(by.css('[ng-click="mapAttribute()"]')).click();
      //delete rows
      element(by.id('subTable')).click();
      browser.sleep(200);
      element.all(by.id('subtableList li')).then(function(items) {
        items[1].click();
      }); 
      element(by.css('[ng-click="addToList()"]')).click();
      browser.sleep(200);
      var ele = element.all(by.repeater('tableLists.ProductAttributeValuesList')).get(1);
      browser.actions().doubleClick(ele).perform();
      browser.sleep(200);
      element(by.css('[ng-click="removeProperty()"]')).click();
      browser.sleep(300);
      element(by.css('[ng-click="acceptDelete()"]')).click();
      browser.sleep(300);
      element.all(by.id('mapName')).sendKeys(helper.getRandomString(3)+helper.getRandomNumber(2));
      element(by.css('[ng-click="saveMappingStep(map, tableData)"]')).click();
      browser.sleep(200);
      element(by.buttonText('Create Mapping')).click();
    });

    describe('show error message(s) if sufficent details are not provided for', function() {
      beforeEach(function() {
        browser.sleep(200);
      });

      it('map', function(){     
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
      });

      it('auto attribute map', function(){    
        element(by.css('[ng-click="mapAttribute()"]')).click();
        browser.sleep(200);
        element.all(by.css('.growl-message')).then(function(items) {
          expect(items[0].getText()).toContain('Select column name');
        }); 
      });


      it('selecting sub table', function(){   
        browser.executeScript('window.scrollTo(500,500)');  
        browser.sleep(200);
        element(by.css('[ng-click="addToList()"]')).click();
        browser.sleep(200);
        element.all(by.css('.growl-message')).then(function(msgs) {
          expect(msgs[0].getText()).toContain('Please select table name to add');
        });
        browser.sleep(200);
        element.all(by.css('[ng-click="growlMessages.deleteMessage(message)"]')).then(function(items) { 
          items[0].click();
        });
      });

      it('removing sub table', function(){ 
        browser.executeScript('window.scrollTo(500,500)');  
        browser.sleep(200);
        element(by.css('[ng-click="removeProperty()"]')).click();
        browser.sleep(200);
        element.all(by.css('.growl-message')).then(function(items) {
          expect(items[0].getText()).toContain('Select table to delete');
        });
        browser.sleep(200);
        element.all(by.css('[ng-click="growlMessages.deleteMessage(message)"]')).then(function(items) { 
          items[0].click();
        });
      });   

      it('save mapping', function(){   
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

    }); 

  });

});
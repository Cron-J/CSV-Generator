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
    browser.sleep(300);
    helper.mapFunction(); 
    element(by.id('subTable')).click();
    browser.sleep(200);
    element.all(by.id('subtableList li')).then(function(items) {
      items[1].click();
    }); 
    element(by.css('[ng-click="addToList()"]')).click();
    browser.sleep(200);
    var ele = element.all(by.repeater('tableLists.ProductAttributeValuesList')).get(0);
    browser.actions().doubleClick(ele).perform();
    browser.sleep(300);
    element.all(by.id('mapName')).sendKeys(helper.getRandomString(3)+helper.getRandomNumber(2));
    element(by.css('[ng-click="saveMappingStep(map, tableData)"]')).click();
    browser.sleep(500);

  });

  afterEach(function() {
    browser.sleep(500);
  });

  describe('able to', function() {

    it('get imported mapping', function(){  
      element.all(by.id('mapId option')).then(function(items) {
        items[1].click();
      });
      browser.sleep(300); 
      element.all(by.buttonText('Next')).then(function(items) {
        items[2].click();
      });
      browser.executeScript('window.scrollTo(500,500);')
      browser.sleep(1500);
    });
  });

});
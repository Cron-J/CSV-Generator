exports.getRandomString = function (characterLength) {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < characterLength; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomText;
};

exports.getRandomNumber = function (characterLength) {
    var randomNumber = "";
    var possible = "0123456789";
    for (var i = 0; i < characterLength; i++)
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    return randomNumber;
};

exports.uploadFile = function (file_path) {
		var path = require('path');
    var fileToUpload = file_path;
    var absolutePath = path.resolve(fileToUpload);
    element.all(by.css('input[type="file"]')).then(function(items) {
      items[0].sendKeys(absolutePath);
    });
    browser.sleep(500);
};

exports.mapFunction = function () {
	var col = element.all(by.repeater('columnShowList')).get(0);
  browser.actions().doubleClick(col).perform();
  browser.sleep(200);
  var table = element.all(by.id('SelectId option')).get(0);
  browser.actions().doubleClick(table).perform();
  browser.sleep(500);
  var prop = element.all(by.repeater('propertyList')).get(13);
  browser.actions().doubleClick(prop).perform();
  browser.sleep(300);   
  element(by.css('[ng-click="mapping()"]')).click();
  browser.sleep(200);
}
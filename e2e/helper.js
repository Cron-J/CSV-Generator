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
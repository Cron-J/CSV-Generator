CSV Generator
========================

### Install an app

Run the following command in root directory of an app in command prompt.

###### *Install node packages*

server/ npm install

###### *Install bower components*

client/src/ bower install

### Run an app

###### *Run Server*

Run the following command in root directory of an app in command prompt.

server/ node server.js

You can see the port number in command prompt after sucessfull run

You can change the settings in server/config/config.js file

###### *Run Mocha*

Test cases are written using Mocha for nodejs testing and protractor for angularjs.

Mocha is a simple, flexible, fun JavaScript test framework for node.js and the browser.

###### *How to run node test*

npm install -g mocha

Run Project and correspondingly use following command in server folder of an app in command prompt.

mocha

 [![Mocha test framework](http://f.cl.ly/items/3l1k0n2A1U3M1I1L210p/Screen%20Shot%202012-02-24%20at%202.21.43%20PM.png)](http://mochajs.org)

### Run test cases
###### *How to run angular test*

1. *Initial setup*

    Install jdk and add path to environmental variables

    npm install -g protractor

    webdriver-manager update
    
2. *Requirements to run test cases*
 
    create one csv file with name demo.csv using e2e/demo.csv file details

    put this file on your Desktop (where ever you want)
    
    update your file location in all test suits where ever you find the file path 'C:/Users/Cronj-4/Desktop/demo.csv'
    
3. *Commands to run*

    webdriver-manager start

    protractor

For more details visit [protractor] (http://angular.github.io/protractor/#/)


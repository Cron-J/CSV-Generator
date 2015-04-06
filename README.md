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


'use strict';

/* defining the app */
var app = angular
	.module("app", ['ngResource', 'angularFileUpload', 'ngRoute', 'angular-growl'])
	.config(['$routeProvider','growlProvider', function($routeProvider, growlProvider) {

    growlProvider.globalTimeToLive(5000);
    $routeProvider
			.when('/', {templateUrl: 'app/partials/home.html'})
			.otherwise({redirectTo: '/'});
	}]);

'use strict';

/* defining the app */
var app = angular
	.module("app", ['ngResource', 'angularFileUpload', 'ngRoute', 'ngLodash'])
	.config(['$routeProvider', function($routeProvider) {

    $routeProvider
			.when('/', {templateUrl: 'app/partials/home.html'})
			.otherwise({redirectTo: '/'});
	}]);

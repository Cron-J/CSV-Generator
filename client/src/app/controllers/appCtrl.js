app.controller('appCtrl', ['$scope', '$rootScope','$location', function($scope, $rootScope, $location) {

	$scope.moveToMappingEditor = function () {
		if($location.path() == '/')
			$scope.$broadcast('redirectToMappingEditor','createMapping');
		else
			$location.path('/');
	}

	$scope.moveToEditMapping = function () {
		if($location.path() == '/')
			$scope.$broadcast('editMapping','editMapping');
		else{
			$location.path('/');
			$scope.$broadcast('editMapping','editMapping');
		}
	}

}])
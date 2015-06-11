'use strict';
app.factory('MapperService',['$http',function($http){
	var mapper = {};
	mapper.getMappingList = function(tenantId){
		return $http.get('/getMappingList/'+ tenantId)
	}

	mapper.getMappingCSV = function(tenantId, mappingId){
		return $http.get('/getMappingCSV/'+ tenantId + '/' + mappingId)
	}

	mapper.getMappingData = function(tenantId, mappingId){
		return $http.get('/getMapping/'+ tenantId + '/' + mappingId)
	}
	
	mapper.getPropertyList = function(url){
		url = 'http://'+url+'/getProductSchema';
		return $http.get(url)
	}

	mapper.getConfigData = function(){
		return $http.get('/getConfig')
	}

	return mapper;

	

}])
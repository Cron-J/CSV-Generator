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
		url = 'http://localhost:8080/getProductSchema';
		return $http.get(url)
	}

	mapper.getConfigData = function(){
		return $http.get('/getConfig')
	}

	mapper.getSynonyms = function(url){
		url = 'http://'+url+'/getSynonyms';
		return $http.get(url)
	}

	return mapper;

	

}])
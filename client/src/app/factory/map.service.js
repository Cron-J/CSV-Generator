'use strict';
app.service('MapperService',['$http',function($http){

	this.getMappingList = function(tenantId){
		return $http.get('/getMappingList/'+ tenantId)
	}

	this.getMappingCSV = function(tenantId, mappingId){
		return $http.get('/getMappingCSV/'+ tenantId + '/' + mappingId)
	}

	this.getMappingData = function(tenantId, mappingId){
		return $http.get('/getMapping/'+ tenantId + '/' + mappingId)
	}
	
	this.getPropertyList = function(){
		return $http.get('/getAttributes')
	}
	

}])
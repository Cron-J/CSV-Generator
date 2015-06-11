angular
    .module('app')
    .directive('downloadJsonFile', function() {
    	return {
    		restrict: 'E',
    		scope:{
    			data:'@'
    		},
    		link : function(scope,ele,attrs){
    			scope.$watch('data', function(){
    				if(scope.data){
    					var data = "text/json;charset=utf-8," + escape(
    						JSON.stringify(scope.data));
    					$('<a class="btn btn-primary pull-right" href="data:' + data + '" download="preview.json">Import Json</a>').appendTo(ele);
    					
    					
    				}
    			})
    			
    		}
    	}
    })
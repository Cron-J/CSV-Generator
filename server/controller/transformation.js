'use strict';

exports.getTransformation = function(arr, value){
	var result = value;
	for (var i=0; i <arr.length; i++){
		if(arr[i].text.substring(0,6) == "append"){
			var appendValue = arr[i].params[0];
			result = append(appendValue,result);
		}
		else if(arr[i].text.substring(0,7) == "prepend"){
			var prependValue = arr[i].params[0];
			result = prepend(prependValue,result);
		}
		else if(arr[i].text.substring(0,9) == "lowercase"){
			result = lowercase(result);
		}
		else if(arr[i].text.substring(0,16) == "removeWhitespace"){
			result = removewhitespace(result);
		}
		else if(arr[i].text.substring(0,15) == "removeDelimiter"){
			var delimeter = arr[i].params[0];
			result = removedelimeters(delimeter,result)
		}
		else if(arr[i].text.substring(0,9) == "uppercase"){
			result = uppercase(result);
		}
		else if(arr[i].text.substring(0,5) == "first"){
			var range = parseInt(arr[i].params[0]);
			result = first(range, result);
		}
		else if(arr[i].text.substring(0,4) == "last"){
			var range = parseInt(arr[i].params[0]);
			result = last(range, result);
		}
		else if(arr[i].text.substring(0,6) == "regExp"){
			// var test = regularExp(arr[i].params[0],parseInt(arr[i].params[1]));
			// console.log(test);
		}
	}
	return result;
};

var regularExp = function(regularExp, value){
	// console.log(regularExp+"-------------------------"+value);
	// var  r = new RegExp(regularExp, value);
	// r.compile("new foo", "g");
	// return r;
};

var first = function(range, value){
	if(typeof(value) == "string" && typeof(range) == "number"){
		 return value.substring(0, range-1);
	}
	else{
		return value;
	}
};

var last = function(range, value){
	if(typeof(value) == "string" && typeof(range) == "number"){
		 return value.substring((value.length)-range, value.length);
	}
	else{
		return value;
	}
};

var removewhitespace = function(value){
	if(typeof(value) == "string"){
		 return value.replace(/\s/g, "");
	}
	else{
		return value;
	}
};

var removedelimeters = function(delimeter, value){
	if(typeof(value) == "string" && typeof(delimeter) == "string"){
		 var delimeter = new RegExp( '(' + delimeter + ')', 'gi' );
		return value.replace(delimeter, "");
	}
	else{
		return value;
	}
};

var uppercase = function(value){
	if(typeof(value) == "string"){
		return value.toUpperCase();
	}
	else{
		return value;
	}
};

var lowercase = function(value){
	if(typeof(value) == "string"){
		return value.toLowerCase();
	}
	else{
		return value;
	}
};

var prepend = function(prependvalue,value) {
	if (typeof(prependvalue) == "number" && typeof(value) == "number"){
		return (JSON.stringify(prependvalue)+JSON.stringify(value));
	}
	else if(typeof(prependvalue) == "string" && typeof(value) == "string"){
		return (prependvalue+value);
	}
	else if(typeof(prependvalue) == "number" && typeof(value) == "string"){
		return (JSON.stringify(prependvalue)+value);
	}
	else if(typeof(prependvalue) == "string" && typeof(value) == "number"){
		return (prependvalue+JSON.stringify(value));
	}
	else{
		return value;
	}	
};

var append = function(appendvalue,value) {
	if (typeof(appendvalue) == "number" && typeof(value) == "number"){
		return (JSON.stringify(value)+JSON.stringify(appendvalue));
	}
	else if(typeof(appendvalue) == "string" && typeof(value) == "string"){
		return (value+appendvalue);
	}
	else if(typeof(appendvalue) == "number" && typeof(value) == "string"){
		return (value+JSON.stringify(appendvalue));
	}
	else if(typeof(appendvalue) == "string" && typeof(value) == "number"){
		return (JSON.stringify(value)+appendvalue);
	}
	else{
		return value;
	}	
};
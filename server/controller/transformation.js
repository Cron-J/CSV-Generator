'use strict';

exports.getTransformation = function(arr, value){
	for (var i=0; i <arr.length; i++){
		console.log(arr[i]);
	}

};

var regularExp = function(regularExp, value){
	return (new RegExp(/ab+c/, 'i'));
};

var first = function(number, value){
	if(typeof(value) == "string" && typeof(number) == "number"){
		 return value.substring(0, number-1);
	}
	else{
		return value;
	}
};

var last = function(number, value){
	if(typeof(value) == "string" && typeof(number) == "number"){
		 return value.substring((value.length)-number, value.length);
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
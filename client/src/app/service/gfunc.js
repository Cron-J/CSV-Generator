
angular.module('app')

  .factory('gfunc', function() {
    var index = [];
    var categories = {
      
      Combine: [],
      Transform: [],
      // Calculate: [],
      Filter: [],
      // Special: []
  };

  function addFuncDef(funcDef) {
    funcDef.params = funcDef.params || [];
    funcDef.defaultParams = funcDef.defaultParams || [];

    if (funcDef.category) {
      funcDef.category.push(funcDef);
    }
    index[funcDef.name] = funcDef;
    index[funcDef.shortName || funcDef.name] = funcDef;
  }

  var optionalSeriesRefArgs = [
    { name: 'other', type: 'value_or_series', optional: true },
    { name: 'other', type: 'value_or_series', optional: true },
    { name: 'other', type: 'value_or_series', optional: true },
    { name: 'other', type: 'value_or_series', optional: true },
    { name: 'other', type: 'value_or_series', optional: true }
  ];


// Transformation 

  addFuncDef({
    name: 'lowercase',
    category: categories.Transform,
    params: [],
  }); 

  addFuncDef({
    name: 'removeDelimiter',
    category: categories.Transform,
    params: [],
  });

  addFuncDef({
    name: 'removeWhitespace',
    category: categories.Transform,
    params: [],
  });

  addFuncDef({
    name: 'uppercase',
    category: categories.Transform,
    params: [],
  });


// Combine

  addFuncDef({
    name: 'append',
    params: [{name:"appendedString"}],
    defaultParams: ['#A'],
    category: categories.Combine,
  });

  addFuncDef({
    name: 'prepend',
    // shortName: 'map',
    params: [{ name: "prependString"}],
    defaultParams: ['#A'],
    category: categories.Combine,
  });

  
// Filter functions


  addFuncDef({
    name: 'first',
    category: categories.Filter,
    params: [{ name: "firstFilter", type: "int", }],
    defaultParams: [5]
  });

  addFuncDef({
    name: 'last',
    category: categories.Filter,
    params: [{ name: "lastFilter", type: "int", }],
    defaultParams: [5]
  });


  addFuncDef({
    name: 'regExp',
    category: categories.Filter,
    params: [
      { name: "exp", type: "string" },
      { name: "nthOccurence", type: "int" },
      
    ],
    defaultParams: ["/^[a-z ,.'-]+$/i", 3]
  });



  _.each(categories, function(funcList, catName) {
    categories[catName] = _.sortBy(funcList, 'name');
  });

  function FuncInstance(funcDef, options) {
    this.def = funcDef;
    this.params = [];

    if (options && options.withDefaultParams) {
      this.params = funcDef.defaultParams.slice(0);
    }

    this.updateText();
  }

  FuncInstance.prototype.render = function(metricExp) {
    var str = this.def.name + '(';
    var parameters = _.map(this.params, function(value, index) {

      var paramType = this.def.params[index].type;
      if (paramType === 'int' || paramType === 'value_or_series' || paramType === 'boolean') {
        return value;
      }
      else if (paramType === 'int_or_interval' && $.isNumeric(value)) {
        return value;
      }

      return "'" + value + "'";

    }, this);

    str=str+parameters.join(', ')+')';

    if (metricExp=="") {
      return str;
    }
    else{
      var strtindex = metricExp.indexOf(')');
      if(metricExp[strtindex-1]=='('){
          return metricExp.slice(0,strtindex) + str + metricExp.slice(strtindex,metricExp.length);
        }
      else if(metricExp[strtindex-1]!='('){
        return metricExp.slice(0,strtindex) +', '+ str + metricExp.slice(strtindex,metricExp.length);
      }

    }
    
  };

  FuncInstance.prototype._hasMultipleParamsInString = function(strValue, index) {
    if (strValue.indexOf(',') === -1) {
      return false;
    }

    return this.def.params[index + 1] && this.def.params[index + 1].optional;
  };

  FuncInstance.prototype.updateParam = function(strValue, index) {
    // handle optional parameters
    // if string contains ',' and next param is optional, split and update both
    if (this._hasMultipleParamsInString(strValue, index)) {
      _.each(strValue.split(','), function(partVal, idx) {
        this.updateParam(partVal.trim(), idx);
      }, this);
      return;
    }

    if (strValue === '' && this.def.params[index].optional) {
      this.params.splice(index, 1);
    }
    else {
      this.params[index] = strValue;
    }

    this.updateText();
  };

  FuncInstance.prototype.updateText = function () {
    if (this.params.length === 0) { 
      this.text = this.def.name + '()';
      return;
    }

    var text = this.def.name + '(';
    text += this.params.join(', ');
    text += ')';
    this.text = text;
  };

  return { 
    createFuncInstance: function(funcDef, options) {
      if (_.isString(funcDef)) {
        if (!index[funcDef]) {
          throw { message: 'Method not found ' + name };
        }
        funcDef = index[funcDef];
      }
      return new FuncInstance(funcDef, options);
    },

    getFuncDef: function(name) {
      return index[name];
    },

    getCategories: function() {
      return categories;
    }
  };

})

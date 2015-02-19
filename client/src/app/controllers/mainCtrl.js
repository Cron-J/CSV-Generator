'use strict';

/* Controller */

app
	.controller('mainCtrl',['$scope', '$http', 'growl', '$location', '$timeout', 
     '$filter', '$upload', 'XLSXReaderService',
		function($scope, $http, growl, $location, $timeout, $filter, $upload,  
      XLSXReaderService){
		var _scope = {};
    $scope.badge={}
		_scope.init = function(){
      $scope.firstStep();
      $scope.tableData = [];
      $scope.defaultVal={
        val:null
      }
		}

  $scope.member = {roles: []};
  $scope.selected_items = [];
  $scope.roles= [ {id:  "Lower Case"}, 
                  {id: "Upper Case"}, 
                  {id: "Remove Whitespace"}, 
                  {id: "Remove Delimiter"},
                  {id: "Regexp(regExpr,nthOccurence)"},
                  {id: "First(noOfChars)"},
                  {id: "Last(noOfChars)"},
                  {id: "Append(String)"},
                  {id: "Prepend(String)"} ];

    //mapping
    $scope.selectColumn = function (info) {
      $scope.selectedColumn = info;
    }

    //automatically mapped coloumns
    $scope.autoMap = function () {
      if($scope.propertyList){
        for(var j = 0; j < $scope.columnShowList.length ; j++){
          for(var i = 0; i < $scope.propertyList.length ; i++){
            if($scope.propertyList[i].propName == $scope.columnShowList[j].colName) {
              $scope.columnShowList[j].isSelect = true;
              $scope.propertyList[i].isSelect = true;
            }
          }
        }
      } 
    }

    $scope.onLoadMap = function () {
      //table data
      // var k = $scope.tableData.length++;
      // for (var i = 0; i < $scope.propertyList.length; i++) {
      //   for (var j = 0; j < $scope.columnShowList.length; j++) {
      //       if($scope.propertyList[i].propName == $scope.columnShowList[j].colName){
      //         $scope.tableData[k] = {};
      //         $scope.tableData[k].columnName = $scope.columnShowList[j].colName;
      //         $scope.tableData[k].propName.field = $scope.propertyList[i].propName;
      //         if($scope.selectedTable)
      //           $scope.tableData[k].tableName = $scope.selectedTable;
      //         else
      //           $scope.tableData[k].tableName = 'Product';
      //         $scope.tableData[k].aIndex = 1;
      //       }
      //     };
      // };
    

      var list = getTableData('Prices');
      addRows(list, 'Prices');
      list = getTableData('ProductAttributeValues');
      addRows(list, 'ProductAttributeValues');
      list = getTableData('Product2ClassificationGroup');
      addRows(list, 'Product2ClassificationGroup');
      list = getTableData('ContractedProduct');
      addRows(list, 'ContractedProduct');
      list = getTableData('ProductRelations');
      addRows(list, 'ProductRelations');
      list = getTableData('Product');
      addRows(list, 'Product');

    }

    var addRows = function (list, tableName) {
      if(list != undefined){
        for(var j = 0; j < $scope.columnShowList.length ; j++){
          for(var i = 0; i < list.length ; i++){
            if(list[i] == $scope.columnShowList[j].colName) {
              //table data
              if($scope.tableData == undefined)
                $scope.tableData = [];
              var k = $scope.tableData.length++;
              $scope.tableData[k] = {};
              $scope.tableData[k].columnName = $scope.columnShowList[j].colName;
              $scope.tableData[k].propName = $scope.columnShowList[j].colName;
              $scope.tableData[k].quotes = false;
              $scope.tableData[k].tableName = tableName;
              $scope.tableData[k].aIndex = 1;
            }
          }
        }
      }
    }

    $scope.enteredDefaultVal = function (info) {
      $scope.selectedDefaultVal = info;
    }

    var getTableData = function (table, originalTName){
        $http.get('/getAttributes/'+table) 
        .success(function(data){
          if(data){
            switch (table) {
              case 'Product':
                $scope.propertyList = data.Product;
                break;
              case 'Prices':
                $scope.propertyList = data.Price;
                break;
              case 'ProductAttributeValues':
                $scope.propertyList = data.ProductAttributeValue;
                break;
              case 'ProductRelations':
                $scope.propertyList = data.ProductRelation;
                break;
              case 'ContractedProduct':
                $scope.propertyList = data.ContractedProduct;
                break;
              case 'Product2ClassificationGroup':
                $scope.propertyList = data.Product2ClassificationGroup;
                break;
              return $scope.propertyList;
            }
            if($scope.propertyList){
              var modifiedList = $scope.propertyList;
              $scope.propertyList = [];
              for(var i = 0; i < modifiedList.length ; i++){  
                $scope.propertyList[i] = {};
                $scope.propertyList[i] = modifiedList[i];
                $scope.propertyList[i].isSelect = false;  
              }
              mappedPropColumns(originalTName);
            }
          } 
        })
        .error(function(){
          growl.error("Unable to get attributes");
        });
    }

    $scope.selectTable = function (tname, otname, rowNo) {
      getTableData(tname, otname);
      $scope.selectedTable = tname;
      $scope.rowId = rowNo+1;
      // if($scope.mapDone == true){
      //   //clear selection before auto map
      //   for(var i = 0; i < $scope.columnShowList.length ; i++){   
      //     $scope.columnShowList[i].isSelect = false;      
      //   }
      //   //do map for same names
      //   $scope.autoMap();
      // }
      
    }

    $scope.selectProperty = function (info) {
      $scope.selectedProperty = info;
    }

    $scope.selectnewPropTable = function (info) {
      $scope.pickedTable = info;
    }

    $scope.updateList = function () {
      if($scope.pickedTable == 'Price'){
        if($scope.PricesList == undefined){
          $scope.PricesList = [];
        }
        $scope.PricesList.length++;
        for(var i = 0; i < $scope.PricesList.length ; i++){   
          $scope.PricesList[i] = 'Price'+'('+(i+1)+')'; 
          $scope.rowId = i+1;     
        }
      }
      if($scope.pickedTable == 'ProductAttributeValue'){
        if($scope.ProductAttributeValuesList == undefined){
          $scope.ProductAttributeValuesList = [];
        }
        $scope.ProductAttributeValuesList.length++;
        for(var i = 0; i < $scope.ProductAttributeValuesList.length ; i++){   
          $scope.ProductAttributeValuesList[i] = 'ProductAttributeValue'+'('+(i+1)+')';      
          $scope.rowId = i+1;
        }

      }
      if($scope.pickedTable == 'ClassificationAssignment'){
        if($scope.ClassificationAssignmentsList == undefined){
          $scope.ClassificationAssignmentsList = [];
        }
        $scope.ClassificationAssignmentsList.length++;
        for(var i = 0; i < $scope.ClassificationAssignmentsList.length ; i++){   
          $scope.ClassificationAssignmentsList[i] = 'ClassificationAssignment'+'('+(i+1)+')';      
        }
      }
      if($scope.pickedTable == 'ProductRelation'){
        if($scope.ProductRelationsList == undefined){
          $scope.ProductRelationsList = [];
        }
        $scope.ProductRelationsList.length++;
        for(var i = 0; i < $scope.ProductRelationsList.length ; i++){   
          $scope.ProductRelationsList[i] = 'ProductRelation'+'('+(i+1)+')';      
        }
      }
      if($scope.pickedTable == 'ContractedProduct'){
        if($scope.ContractedProductList == undefined){
          $scope.ContractedProductList = [];
        }
        $scope.ContractedProductList.length++;
        for(var i = 0; i < $scope.ContractedProductList.length ; i++){   
          $scope.ContractedProductList[i] = 'ContractedProduct'+'('+(i+1)+')';      
        }
      }
      if($scope.pickedTable == 'DocumentAssociations'){
        if($scope.DocumentAssociationsList == undefined){
          $scope.DocumentAssociationsList = [];
        }
        $scope.DocumentAssociationsList.length++;
        for(var i = 0; i < $scope.DocumentAssociationsList.length ; i++){   
          $scope.DocumentAssociationsList[i] = 'DocumentAssociation'+'('+(i+1)+')';      
        }
      }

    }

    $scope.mapping = function () {
      if(($scope.selectedColumn || $scope.selectedDefaultVal) && $scope.selectedTable && $scope.selectedProperty){
        var i = $scope.tableData.length++;
        $scope.tableData[i] = {"columnName": null, "propName": null, "isSelect":false,
                        "tableName": null, "aIndex": 0, "quotes": false , "rowId":0};
        $scope.tableData[i].columnName = $scope.selectedColumn;
        $scope.tableData[i].propName = $scope.selectedProperty;
        $scope.tableData[i].tableName = $scope.selectedTable;
        $scope.tableData[i].rowId = $scope.rowId;
        $scope.tableData[i].isSelect = true;
        if($scope.selectedDefaultVal != null){
          $scope.tableData[i].columnName = $scope.selectedDefaultVal;
          $scope.selectedDefaultVal = null;
          $scope.tableData[i].quotes = true;
        }
        for(var j = 0; j < $scope.tableData.length; j++){
          if($scope.tableData[j].tableName == $scope.selectedTable){
            $scope.tableData[i].aIndex++;
          }
        }
        mappedColumns($scope.selectedColumn);
        mappedPropColumns($scope.selectedTable);
        $scope.defaultVal.val = '';
        $scope.selectedColumn = undefined;
        $scope.selectedTable = undefined;
        $scope.selectedProperty = undefined;
      }
    }

    $scope.mapAttribute = function () {
      if($scope.selectedColumn == 'gross_price' || $scope.selectedColumn == 'retail_price' 
        || $scope.selectedColumn == 'grossprice' || $scope.selectedColumn == 'retailprice'){
        $scope.pickedTable = "Price";
      } else {
        $scope.pickedTable = "ProductAttributeValue";
      }
        $scope.updateList();
        if($scope.selectedColumn){
          if($scope.tableData == undefined){
            $scope.tableData = [];
          } 
          var dummy = {"columnName": null, "propName": null, 
                          "tableName": null, "aIndex": 0, "quotes": false, "rowId":0, "ma":true };
          var i = $scope.tableData.length++;
          var j = $scope.tableData.length++;
          for(var k = $scope.tableData.length ; k > 0; k--){
            if(i == k-2){
              $scope.tableData[i] = angular.copy(dummy);
              $scope.tableData[i].columnName = $scope.selectedColumn;
              $scope.tableData[i].tableName = $scope.pickedTable;
              $scope.tableData[i].rowId = angular.copy($scope.rowId);
              $scope.tableData[i].quotes = true;
              if($scope.tableData[i].tableName == $scope.pickedTable){
                $scope.tableData[i].aIndex++;
              }
              if($scope.selectedColumn == 'gross_price' || $scope.selectedColumn == 'retail_price' ||
                $scope.selectedColumn == 'grossprice' || $scope.selectedColumn == 'retailprice'){
                $scope.tableData[i].propName = {};
                $scope.tableData[i].propName.field = 'priceUnit';
                $scope.tableData[i].propName.reference = {};
                $scope.tableData[i].propName.index = null;
              } else {
                $scope.tableData[i].propName = {};
                $scope.tableData[i].propName.field = 'attribute';
                $scope.tableData[i].propName.reference = {};
                $scope.tableData[i].propName.index = null;
              }
            }
            if(j == k-1){
              // console.log('j value', j);
              $scope.tableData[j] = angular.copy(dummy);
              $scope.tableData[j].columnName = $scope.selectedColumn;
              $scope.tableData[j].tableName = $scope.pickedTable;
              $scope.tableData[j].rowId = angular.copy($scope.rowId);
              if($scope.selectedColumn == 'gross_price' || $scope.selectedColumn == 'retail_price' 
                || $scope.selectedColumn == 'grossprice' || $scope.selectedColumn == 'retailprice'){
                $scope.tableData[j].propName = {};
                $scope.tableData[j].propName.field = 'priceTypeId';
                $scope.tableData[j].propName.reference = {};
                $scope.tableData[j].propName.index = null;
              } else {
                $scope.tableData[j].propName = {};
                $scope.tableData[j].propName.field = 'value';
                $scope.tableData[j].propName.reference = {};
                $scope.tableData[j].propName.index = null;
              }
              if($scope.tableData[j].tableName == $scope.pickedTable){
                $scope.tableData[j].aIndex = $scope.tableData[j].aIndex+2;
              }
            }
          }

        mappedColumns($scope.selectedColumn);
        mappedPropColumns($scope.pickedTable);
        // console.log($scope.tableData);
        $scope.defaultVal.val = '';
        $scope.selectedColumn = undefined;
        $scope.selectedTable = undefined;
        $scope.selectedProperty = undefined;
      }
    }

    //automatic mapping
    $scope.automaticMap = function () {
      $scope.onLoadMap();
      $scope.mapDone = true;
      //curentlist mapped properties
      $scope.autoMap();

    }

    $scope.removeRow = function (propName, colName, index) {
      $scope.tableData.splice(index, 1);
      mappedColumns(colName, true);
      mappedPropColumns(undefined, propName);
    }

    var mappedColumns = function (col, remove) {
      //mapped input columns
      if(remove == true){
        for(var j = 0; j < $scope.columnShowList.length; j++){
          if($scope.columnShowList[j].colName == col){
            $scope.columnShowList[j].isSelect = false;
          } 
        }
      } 
      for(var j = 0; j < $scope.columnShowList.length; j++){
        for(var i = 0; i < $scope.tableData.length; i++){
          if($scope.columnShowList[j].colName == $scope.tableData[i].columnName){
            $scope.columnShowList[j].isSelect = true;
          } 
        }
      }
    }
   var mappedPropColumns = function (tname, propName) {
      //mapped propertyList columns
      for(var i = 0; i < $scope.propertyList.length; i++){
        for(var j = 0; j < $scope.tableData.length; j++){
          if($scope.propertyList[i].field == $scope.tableData[j].propName.field && 
            $scope.tableData[j].tableName == tname){
            $scope.propertyList[i].isSelect = true;
          } 
        }
        if(propName){
          for(var i = 0; i < $scope.propertyList.length; i++){
            if($scope.propertyList[i].field == propName)
              $scope.propertyList[i].isSelect = false;
          }
        }
      }
   }

    $scope.startRead = function(files) {
      // $scope.secondStep();
      var file = files[0];
      if (file) {
        var name = file.name.split(".");
        if(name[name.length - 1] == "csv" ){
          $scope.uploadedFileType = 'csv';
          getData(file);
        }
        else if(name[name.length - 1] == "xlsx"){
          $scope.uploadedFileType = 'xlsx';
          $scope.fileChanged(files);
          $scope.updateJSONString(); 
          $scope.showPreviewChanged();
        } 
        else{
          console.log('entered file type is otherthan csv or xls');
        }
      }
    }

    var getData = function (readFile) {
      var reader = new FileReader();
      reader.readAsText(readFile);
      reader.onload = processData;
    }

    var processData = function (allText) {
      // $scope.secondStep(); 
      // console.log('pd',$scope.badge.step);
      var result=allText.srcElement.result;
      var allTextLines = result.split('+/\r\n|\n/+');
      var headers = allTextLines[0].split("\n")[0];
      var tableData = allTextLines[0].split("\n");
      var dumpTable =[];
      var k=0;
      for (var i = 0; i < tableData.length; i++) {
        if(tableData[i] != "\r"){
          dumpTable[k] = tableData[i];
          k++;
        }
      };
      // console.log('dumpTable', dumpTable);
      $scope.columnList = headers.split(",");
      $scope.importedData = tableData;
      $scope.importedDatar1 = dumpTable[1].split(",");
      $scope.importedDatar2 = dumpTable[2].split(",");

      // loading columns
      loadingColumns();
    }

    var loadingColumns = function () {
      var selectedColumns = [];
      for (var i = 0; i < $scope.columnList.length; i++) {
        selectedColumns[i] = {"colName":null, "isSelect":null};
        selectedColumns[i].colName = $filter('smallize')($scope.columnList[i]);
        selectedColumns[i].isSelect = false;
      };
      $scope.columnShowList = selectedColumns;  
      $scope.secondStep(); 
    }

    $scope.showPreview = false;
    $scope.showJSONPreview = true;
    $scope.json_string = "";

    $scope.fileChanged = function(files) {
        $scope.isProcessing = true;
        $scope.sheets = [];
        $scope.excelFile = files[0];
        XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function(xlsxData) {
            $scope.sheets = xlsxData.sheets;
            $scope.isProcessing = false;
        });
    }

    $scope.updateJSONString = function() {
      $scope.showPreview = true;
        $scope.selectedSheetName = 'Sheet1'
        $scope.json_string = JSON.stringify($scope.sheets[$scope.selectedSheetName], null, 2);
    $scope.secondStep();
    }

    $scope.showPreviewChanged = function() {
        if ($scope.showPreview) {
            $scope.showJSONPreview = false;
            $scope.isProcessing = true;
            XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function(xlsxData) {
                $scope.sheets = xlsxData.sheets;
                $scope.columnList = $scope.sheets.Sheet1.data[0];
                loadingColumns();
                $scope.isProcessing = false;
            });
        }
    }

    //check required fields mapping is done or not
    var checkMapping = function (tableInfo) {
      var reqFieldList = [];
      var k = 0;
      for (var i = 0; i < $scope.propertyList.length; i++) {
        if($scope.propertyList[i].isRequired){
          reqFieldList.length++;
          reqFieldList[k] = $scope.propertyList[i].field;
        }
      };
      var clength = 0;
      for (var i = 0; i < tableInfo.length; i++) {
        for (var j = 0; j < reqFieldList.length; j++) {
          if(tableInfo[i].propName.field == reqFieldList[j]){
            clength++;
          }
        }
      };
      if(clength == reqFieldList.length)
        return true;
      else {
        return false;
      }
    }

    //save maaping
    var saveMapping = function (map){
        $http.post('/createMapping', map)
          .success(function(data){
            growl.success("Mapping has been saved successfully");
          })
          .error(function(){
            growl.error("Unable to save Mapping");
          });
    }

    //Steps involved
    $scope.firstStep = function (){
      $scope.badge.step = "one";
    } 

    $scope.secondStep = function () {
      $scope.badge.step = "two";
      $scope.selectTable('Product');
    }

    $scope.thirdStep = function (info) {
      $scope.badge.step = "three";
    }

    $scope.fourthStep = function (map, tableInfo) {
      if(map){
        $scope.submitted = false;
        // $scope.map = {};
        // $scope.map.details = mapInfo;
        // $scope.map.tableData = [];
        // $scope.map.tableData = tableInfo;
        var valid = checkMapping(tableInfo);
        if(valid == true){
          var mappingDetails = {};
          mappingDetails.tenantId = 1;
          mappingDetails.mappingName = map.name;
          mappingDetails.mappingInfo = [];
          for (var i = 0; i < tableInfo.length; i++) {
            mappingDetails.mappingInfo[i] = {
              "userFieldName": tableInfo[i].columnName,
              "collectionName": tableInfo[i].tableName,
              "fieldDetail": tableInfo[i].propName
            };
          };
          saveMapping(mappingDetails);
          $scope.badge.step = "four";
        } else {
          growl.error("Please map all required fields before trying to save mapping");
        }
        
      } else {
        $scope.submitted = true;
      }
    }

//     /*testing  xls file content formate*/

//     var handleDrop=function(e){
//   e.stopPropagation();
//   e.preventDefault();
//   var files = e.dataTransfer.files;
//   var i,f;
//   for (i = 0, f = files[i]; i != files.length; ++i) {
//     var reader = new FileReader();
//     var name = f.name;
//     reader.onload = function(e) {
//       var data = e.target.result;

//       /* if binary string, read with type 'binary' */
//       var workbook = XLS.read(data, {type: 'utf-16'});

//       /* DO SOMETHING WITH workbook HERE */
//     };
//     reader.readAsBinaryString(f);
//   }
// }
// document.addEventListener('drop', handleDrop, false);

    _scope.init();
	}]);

//directives
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

//filters
app.filter('smallize', function() {
  return function(input, scope) {
    if (input!=null)
    return input.substring(0,1).toLowerCase()+input.substring(1);
  }
});

//factory
app.factory("XLSXReaderService", ['$q', '$rootScope',
    function($q, $rootScope) {
        var service = function(data) {
            angular.extend(this, data);
        }
        service.readFile = function(file, readCells, toJSON) {
            var deferred = $q.defer();

            XLSXReader(file, readCells, toJSON, function(data) {
                $rootScope.$apply(function() {
                    deferred.resolve(data);
                });
            });
            return deferred.promise;
        }
        return service;
    }
]);


app.directive('dropdownMultiselect', function(){
   return {
       restrict: 'E',
       scope:{           
            model: '=',
            options: '=',
            pre_selected: '=preSelected'
       },
       template: "<div class='btn-group' data-ng-class='{open: open}'>"+
        "<button class='btn btn-default'>Select</button>"+
                "<button class='btn btn-default dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" + 
                    "<li><a data-ng-click='selectAll()'><i class='glyphicon glyphicon-ok-circle'></i>  Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><i class='glyphicon glyphicon-remove-circle'></i>  Uncheck All</a></li>" +                    
                    "<li class='divider'></li>" +
                    "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.id}}<span data-ng-class='isChecked(option.id)','pull-right'></span></a></li>" +                                        
                "</ul>" +
            "</div>" ,
       controller: function($scope){
           
           $scope.openDropdown = function(){        
                    $scope.selected_items = [];
                    for(var i=0; i<$scope.pre_selected.length; i++){                        $scope.selected_items.push($scope.pre_selected[i].id);
                    }                                        
            };
           
            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                console.log($scope.model);
            };            
            $scope.deselectAll = function() {
                $scope.model=[];
                console.log($scope.model);
            };
            $scope.setSelectedItem = function(){
                var id = this.option.id;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                } else {
                    $scope.model.push(id);
                }
                console.log($scope.model);
                return false;
            };
            $scope.isChecked = function (id) {                 
                if (_.contains($scope.model, id)) {
                    return 'glyphicon glyphicon-ok pull-right';
                }
                return false;
            };                                 
       }
   } 
});

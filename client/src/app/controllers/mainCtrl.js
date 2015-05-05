'use strict';

/* Controller */

app
	.controller('mainCtrl',['$scope', '$rootScope', '$http', 'growl', '$location', '$timeout', 
     '$filter', '$upload', '$modal', '$log',
		function($scope, $rootScope, $http, growl, $location, $timeout, $filter, $upload,  
     $modal, $log){
		var _scope = {};
    $scope.badge={}
    $scope.clear={};
		_scope.init = function(){
      $scope.firstStep();
      $scope.resultXls = {};
      defaultBtn();
      defaultFilePreviewSettings();
		}
    var defaultBtn = function () {
      $scope.defaultVal={
        name:"defaultValue",
        value:null
      }
    }

    var defaultFilePreviewSettings = function() {
      $scope.fileStyle = {
        "includeHeader":true,
        // "dateFormat":'',
        // "numberFormat":'',
        "delimeterFormat":',' 
      }
    }

    var rowIndex;
    var transValue;
    $scope.transInfo={pushable:[],transVal:''};

    $scope.clicked = '';
    var contextIndex;
    $scope.saveIndex=function(ind){
      rowIndex=ind;
      if($scope.tableData[rowIndex].transformations && $scope.tableData[rowIndex].transformations.length>=0){
        $scope.transInfo.pushable=$scope.tableData[rowIndex].transformations;
        $rootScope.$broadcast("transformation",$scope.transInfo.pushable);
      }
      else{
        $scope.tableData[rowIndex].transformations=[];
        $scope.transInfo.pushable=$scope.tableData[rowIndex].transformations;
        $rootScope.$broadcast("transformation",$scope.transInfo.pushable);
      }
    }

    $scope.saveTransformationInfo = function(){
      for(var i=0;i<$scope.transInfo.pushable.length;i++){
          delete $scope.transInfo.pushable[i].def.category;
      }
      $scope.tableData[rowIndex].transformations=$scope.transInfo.pushable;
      $scope.tableData[rowIndex].transVal=angular.copy($scope.transInfo.transVal);
      
    };

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

    $scope.enteredDefaultVal = function (info) {
        $scope.selectedDefaultVal = info;
    }

    var getPropertyList = function () {
      $scope.property = {
        "productPropertyList": [],
        "pricePropertyList": [],
        "attributePropertyList": [],
        "prPropertyList": [],
        "cpPropertyList": [],
        "cgaPropertyList": []
      };
      $http.get('/getAttributes') 
        .success(function(data){
          if(data){
            var k = 0;
            for (var i = 0; i < data.length; i++) {
              if(!data[i].values){
                $scope.property.productPropertyList[k] = data[i];
                k++;
              }
              if(data[i].field == 'prices'){
                $scope.property.pricePropertyList = data[i].values;
              }
              if(data[i].field == 'attributeValues'){
                $scope.property.attributePropertyList = data[i].values;
              }
              if(data[i].field == 'productRelations'){
                $scope.property.prPropertyList = data[i].values;
              }
              if(data[i].field == 'contractedProducts'){
                $scope.property.cpPropertyList = data[i].values;
              }
              if(data[i].field == 'classificationGroupAssociations'){
                $scope.property.cgaPropertyList = data[i].values;
              }
            };
          }
        })
        .error(function(){
          growl.error("Unable to get attributes");
        });
    }

    var getTableData = function (table, originalTName){
        switch (table) {
          case 'product':
            $scope.propertyList = $scope.property.productPropertyList;
            break;
          case 'prices':
            $scope.propertyList = $scope.property.pricePropertyList;
            break;
          case 'attributeValues':
            $scope.propertyList = $scope.property.attributePropertyList;
            break;
          case 'productRelations':
            $scope.propertyList = $scope.property.prPropertyList;
            break;
          case 'contractedProducts':
            $scope.propertyList = $scope.property.cpPropertyList;
            break;
          case 'classificationGroupAssociations':
            $scope.propertyList = $scope.property.cgaPropertyList;
            break;
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

    $scope.selectTable = function (tname, otname, rowNo, list) {
      getTableData(tname, otname);
      $scope.selectedTable = otname;
      $scope.rowId = rowNo+1;
      $scope.selectedTableList = list;
    }

    $scope.selectProperty = function (info) {
      $scope.selectedProperty = info;
    }

    $scope.selectnewPropTable = function (info, list) {
      $scope.pickedTable = info;
      $scope.passingList = list;
    }

    $scope.addToList = function () {
      if($scope.passingList){
        $scope.passingList.length ++;
        for(var i = 0; i < $scope.passingList.length ; i++){   
            $scope.passingList[i] = {};
            $scope.passingList[i].table = $scope.pickedTable; 
            $scope.passingList[i].rowId = i+1;     
        }
      } else {
         growl.error("Please select table name to add");
      }
    }

    // removing select tables and its properties

    $scope.removeProperty = function(size) {
      if($scope.selectedTable){
        var modalInstance = $modal.open({
            templateUrl: 'confirmation.html',
            controller: 'confirmationModalInstanceCtrl',
            size: size,
            resolve: {
                    table_scope: function() {
                        return $scope.selectedTable;
                    },
                    row_no: function() {
                      return $scope.rowId;
                    }
            }
        });
        
        modalInstance.result.then(function(cnfDelete) {
          var valid = cnfDelete;
          if(valid){
            $scope.acceptDeletetion();
          }  
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
      } else {
        growl.error("Select table to delete");
      }
    };

    $scope.acceptDeletetion = function () {
      var id;
      if($scope.selectedTable != 'Product'){
        if($scope.selectedTable && $scope.rowId){
          id = $scope.rowId;
          $scope.selectedTableList.splice(id-1, 1);
          updateList($scope.selectedTable, id);
        } 
      } else {
        growl.error("You can't delete Product table");
      } 
    }

    var updateList = function (table, id) {
      var count =0;
      for (var i = $scope.tableData.length - 1 ; i >=0 ;i--) {
        if($scope.tableData[i].tableName == table && 
          $scope.tableData[i].rowId == id) {
          var colName = $scope.tableData[i].columnName;
          var prop = $scope.tableData[i].propName.field;
          $scope.tableData.splice(i, 1);
          mappedColumns(colName, true);
          mappedPropColumns(table, prop);
        }
      }; 
      for (var i = 0; i < $scope.tableData.length ;i++) {
        if($scope.tableData[i].tableName == table && 
          $scope.tableData[i].rowId > id) {
            $scope.tableData[i].rowId = $scope.tableData[i].rowId - 1;
        }
      };
    }

    $scope.mapping = function () {
      if(($scope.selectedColumn || $scope.selectedDefaultVal) && $scope.selectedTable && $scope.selectedProperty){
        var i = $scope.tableData.length++;
        $scope.tableData[i] = {"columnName": null, "propName": null, "isSelect":false,
                        "tableName": null, "defaultVal": null, "aIndex": 0, "quotes": false , "rowId":0,"transformations":[]};
        $scope.tableData[i].columnName = $scope.selectedColumn;
        $scope.tableData[i].propName = $scope.selectedProperty;
        $scope.tableData[i].tableName = $scope.selectedTable;
        $scope.tableData[i].rowId = $scope.rowId;
        $scope.tableData[i].isSelect = true;
        if($scope.selectedDefaultVal != null){
          $scope.tableData[i].columnName = $scope.selectedDefaultVal.name;
          $scope.tableData[i].defaultVal = $scope.selectedDefaultVal.value;
          $scope.selectedDefaultVal = null;
          defaultBtn();
          $scope.tableData[i].quotes = true;
        }
        for(var j = 0; j < $scope.tableData.length; j++){
          if($scope.tableData[j].tableName == $scope.selectedTable){
            $scope.tableData[i].aIndex++;
          }
        }
        mappedColumns($scope.selectedColumn);
        mappedPropColumns($scope.selectedTable);
        $scope.defaultVal.value = '';
        $scope.selectedColumn = undefined;
        $scope.selectedTable = undefined;
        $scope.selectedProperty = undefined;
        $scope.selectedDefaultVal = undefined;
      }
      else {
        growl.error('Select column, table and property names to map');
      } 

      $("option:selected").removeAttr("selected");
    }

    $scope.mapAttribute = function () {
      if($scope.selectedColumn){
        if(($scope.selectedColumn == "gross_price") || ($scope.selectedColumn == "retail_price") 
          || ($scope.selectedColumn == "grossprice") || ($scope.selectedColumn == "retailprice")){
          $scope.pickedTable = "price";
          $scope.passingList = $scope.tableLists.PricesList;
        } else {
          $scope.pickedTable = "attributeValue";
          $scope.passingList = $scope.tableLists.ProductAttributeValuesList;
        }
          $scope.addToList();
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
                // if($scope.selectedDefaultVal != null){
                //   $scope.tableData[i].columnName = $scope.selectedDefaultVal.name;
                //   $scope.tableData[i].defaultVal = $scope.selectedDefaultVal.value;
                //   $scope.selectedDefaultVal = null;
                //   defaultBtn();
                // }
                $scope.tableData[i].quotes = true;
                if($scope.tableData[i].tableName == $scope.pickedTable){
                  $scope.tableData[i].aIndex++;
                }
                if($scope.pickedTable == "price"){
                  $scope.tableData[i].rowId = $scope.tableLists.PricesList.length;
                  for(var q = 0 ; q < $scope.property.pricePropertyList.length ; q++) {
                    if( $scope.property.pricePropertyList[q].field == 'priceUnit'){
                      $scope.tableData[i].propName = {};
                      $scope.tableData[i].propName = $scope.property.pricePropertyList[q];
                    }
                  }
                } else {
                  $scope.tableData[i].rowId = $scope.tableLists.ProductAttributeValuesList.length;
                  for(var q = 0 ; q < $scope.property.attributePropertyList.length ; q++){
                    if( $scope.property.attributePropertyList[q].field == 'attribute'){
                      $scope.tableData[i].propName = {};
                      $scope.tableData[i].propName = $scope.property.attributePropertyList[q];
                    }
                  }
                }
              }
              if(j == k-1){
                $scope.tableData[j] = angular.copy(dummy);
                $scope.tableData[j].columnName = $scope.selectedColumn;
                $scope.tableData[j].tableName = $scope.pickedTable;
                if($scope.pickedTable == "price"){
                  $scope.tableData[j].rowId = $scope.tableLists.PricesList.length;
                  for(var q=0 ; q < $scope.property.pricePropertyList.length ; q++){
                    if( $scope.property.pricePropertyList[q].field == 'priceTypeId'){
                      $scope.tableData[j].propName = {};
                      $scope.tableData[j].propName = $scope.property.pricePropertyList[q];
                    }
                  }
                } else {
                  $scope.tableData[j].rowId = $scope.tableLists.ProductAttributeValuesList.length;
                  for(var q=0 ; q < $scope.property.attributePropertyList.length; q++){
                    if( $scope.property.attributePropertyList[q].field == 'value'){
                      $scope.tableData[j].propName = {};
                      $scope.tableData[j].propName = $scope.property.attributePropertyList[q];
                    }
                  }
                }
                if($scope.tableData[j].tableName == $scope.pickedTable){
                  $scope.tableData[j].aIndex = $scope.tableData[j].aIndex+2;
                }
              }
            }

          mappedColumns($scope.selectedColumn);
          mappedPropColumns($scope.pickedTable);
          $scope.defaultVal.value = '';
          $scope.selectedColumn = undefined;
          $scope.selectedTable = undefined;
          $scope.selectedProperty = undefined;
        }
      }
      else {
        growl.error('Select column name');
      }  
    }

    //automatic mapping
    $scope.automaticMap = function () {
      $scope.onLoadMap();
      $scope.mapDone = true;
      //curentlist mapped properties
      $scope.autoMap();

    }

    $scope.removeRow = function (propName, colName, tname, index) {
      $scope.tableData.splice(index, 1);
      mappedColumns(colName, true);
      mappedPropColumns(tname, propName);
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
      if(propName){  
        for(var i = 0; i < $scope.propertyList.length; i++){
          if($scope.propertyList[i].field == propName) {
            $scope.propertyList[i].isSelect = false; 
          } 
        }   
      }
      for(var i = 0; i < $scope.propertyList.length; i++){
        if($scope.tableData){
          for(var j = 0; j < $scope.tableData.length; j++){
            if($scope.propertyList[i].field == $scope.tableData[j].propName.field && 
              $scope.tableData[j].tableName == tname){
              $scope.propertyList[i].isSelect = true;
            } 
          }
        } 
      }
    }

    $scope.selectedDateFormat = function (format) {
      var list1 = $scope.uploadedData.rowOne;
      var list2 = $scope.uploadedData.rowTwo;
      $scope.uploadedData.rowOne = changeDateFormat(list1, format);
      $scope.uploadedData.rowTwo = changeDateFormat(list2, format);
    }

    var changeDateFormat = function (list, format) {
      if(list){
        for (var i = 0; i < list.length; i++) {
          if(isNaN(list[i])) {
            var d = new Date(list[i]);
            if(d != "Invalid Date"){
              var date = d.getDate();
              if(date < 10) date = "0"+date;
              var month = d.getMonth()+1;
              if(month < 10) month = "0"+month;
              var year = d.getFullYear();
              if(format == "MM/dd/yyyy")
                list[i] = month+"/"+date+"/"+year;
              else
                list[i] = date+"-"+month+"-"+year;
            }
          }
        };
        return list;
      }
    }

    $scope.selectedNumberFormat = function (format) {
      var list1 = $scope.uploadedData.rowOne;
      var list2 = $scope.uploadedData.rowTwo;
      $scope.uploadedData.rowOne = changeNumberFormat(list1, format);
      $scope.uploadedData.rowTwo = changeNumberFormat(list2, format);
    }

    var changeNumberFormat = function (list, format) {
      for (var i = 0; i < list.length; i++) {
        if(!isNaN(list[i])) {
          if(format == '#,##'){
            var str = list[i].slice(0, -2)+','+list[i].slice(-2);
            // if (str[0].length >= 3) {
            //     str[0] = str[0].replace(/(\d)(?=(\d{2})+$)/g, '$1,');
            // }
            // // if (str[1] && str[1].length >= 3) {
            // //     str[1] = str[1].replace(/(\d{2})/g, '$1 ');
            // // }
            list[i] = str;
          }
          if(format == '#.##'){
            list[i] = (list[i] / 100);
          }
          if(format == '#,###.##'){
            if(list[i].toString().length > 5){
              list[i] = (list[i] / 100);
              var str = list[i].toString().split('.');
              if (str[0].length >= 4) {
                str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
              }
              if (str[1] && str[1].length >= 4) {
                  str[1] = str[1].replace(/(\d{3})/g, '$1 ');
              }
              list[i] = str.join('.');
            }

          }
          if(format == '#.###,##'){
            var str = list[i].toString();
            if(str.length > 5){
              str = list[i].slice(0, -5)+'.'+list[i].slice(-3)+','+list[i].slice(-2);
              // var dec = (list[i] % 100000);
              // list[i] = (list[i] / 100000);
              // var str = list[i].toString();
              // var index = str.length-2;
              // str = str.slice(0,index)+ "," + str.slice(index);  
              list[i] = str;  
            }
          }
        }
      }
      return list;
    }

    $scope.selectedDelimiterFormat = function (format) {
      var list = {
          "list0" : $scope.uploadedData.headers.join(),
          "list1" : $scope.uploadedData.rowOne.join(),
          "list2" : $scope.uploadedData.rowTwo.join()
        }
      $scope.uploadedData.headers = changeDelimiterFormat(list.list0, format);
      loadingColumns($scope.uploadedData.headers);
      $scope.uploadedData.rowOne = changeDelimiterFormat(list.list1, format);
      $scope.uploadedData.rowTwo = changeDelimiterFormat(list.list2, format);
    }

    var changeDelimiterFormat = function (list, format) {
      var dump;
      if(format == '.' && list)
          dump = list.split(".");
      else 
          dump = list.split(",");
      return dump;
    }

    $scope.resetData = function () {
      $scope.uploadedData = angular.copy($scope.uploadedDataDump);
      defaultFilePreviewSettings();
    }

    $scope.startRead = function(files) {
      var data = {};
      data.file = files[0];
      data.file_name = files[0].name;
      var fd = new FormData();
      angular.forEach(data, function(value, key) {
        fd.append(key,value);
      });
      $http.post('/uploadedFileData', fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function (data, status) {
          $scope.uploadedDataDump = angular.copy(data);
          $scope.uploadedData = data;
          loadingColumns(data.headers);
      })
      .error(function(data){
        growl.error("Unable to upload file");
      });
    }

    var loadingColumns = function (list) {
      var selectedColumns = [];
      for (var i = 0; i < list.length; i++) {
        selectedColumns[i] = {"colName":null, "isSelect":null};
        // selectedColumns[i].colName = $filter('smallize')(list[i]);
        selectedColumns[i].colName = list[i];
        selectedColumns[i].isSelect = false;
      };
      $scope.columnShowList = selectedColumns;  
      $scope.secondStep(); 
      $scope.selectedDateFormat('dd-MM-yyyy');
    }
    //check required fields mapping is done or not
    var checkMapping = function (tableInfo) {
      var reqFieldList = [];
      var k = 0;
      for (var i = 0; i < $scope.propertyList.length; i++) {
        if($scope.propertyList[i].isRequired){
          reqFieldList[k] = $scope.propertyList[i].field;
          k++;
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

    //save maping
    var saveMapping = function (map){
        $http.post('/createMapping', map)
          .success(function(data){
            $scope.isMapSaved = true;
            growl.success("Mapping has been saved successfully");
            getMappingList(1);
          })
          .error(function(err){

            if(err.statusCode==403){
               growl.error("Mapping name already exist.");
            }
            else
                growl.error("Unable to save Mapping");
          });
    }

    //getMappingList
    var getMappingList = function (tenantId){
      $http.get('/getMappingList/'+ tenantId)
        .success(function(data){
          $scope.mappingList = data;
          angular.forEach($scope.mappingList,function(value,key){
            if(value.mappingName==$scope.map.name){
              $scope.selectedMapping=value;
            }
          })
        })
        .error(function(){
          growl.error("Unable to get mapping list");
        });
    }

    //getMappedJson
    var getMappingJson = function (tenantId, mappingId) {
      $http.get('/getMappingData/'+tenantId+'/'+mappingId)
        .success(function(data){
          $scope.mappedJson = data;
        })
        .error(function(){
          growl.error("Unable to get mapping list");
        });
    }

    //Steps involved
    $scope.firstStep = function (){
      $scope.badge.step = "one";
      //reset data
      if($scope.newMap == true){
        $location.path("#/");
      }
      $scope.tableLists = {
        "PricesList" : [],
        "ProductAttributeValuesList" : [],
        "ClassificationAssignmentsList" : [],
        "ProductRelationsList" : [],
        "ContractedProductList" : []
      }
    } 

    $scope.secondStep = function () {
      $scope.badge.step = "two";
      getPropertyList();
    }

    $scope.reloadStep = function () {
      $location.path("#/");
    }

    $scope.thirdStep = function (info) {
      $scope.badge.step = "three";
      $scope.selectTable('product');
      if($scope.tableData == undefined){
        $scope.tableData = [];
      }
      if($scope.map == undefined){
        $scope.map = {
          name:null
        }
      }
      $scope.fileViewFormats = info;
    }
    // $scope.edit=false;
    // $scope.editMapping = function (map) {
    //   $scope.edit=true;
    //   $scope.badge.step = "three";
    //   $scope.isMapSaved=false;
    //   $http.get('/getMapping/'+map.tenantId+'/'+map._id)
    //     .success(function(data){
    //       $scope.tableData={};
    //       $scope.uploadedData={};
    //       $scope.map={};
    //       $scope.tableData=data[0].mappingInfo;
    //       angular.forEach($scope.tableData,function(val,key){
            
    //       })
    //       $scope.uploadedData.fileName=data[0].fileName;
    //       $scope.map.name=data[0].mappingName;
    //       $scope.fileViewFormats=data[0].delimeter;
          
          
    //     })
      
    // }

    $scope.saveMappingStep = function (map, tableInfo) {
      if(map.name){
        if(tableInfo.length > 0){
          $scope.submitted = false;
          var valid = checkMapping(tableInfo);
          if(valid == true){
            var mappingDetails = {};
            mappingDetails.tenantId = 1;
            mappingDetails.fileName = $scope.uploadedData.fileName;
            mappingDetails.mappingName = map.name;
            mappingDetails.delimeter = $scope.fileViewFormats;
            mappingDetails.mappingInfo = [];
            for (var i = 0; i < tableInfo.length; i++) {
              if(tableInfo[i].tableName == 'product'){
                 mappingDetails.mappingInfo[i] = {
                  "userFieldName": tableInfo[i].columnName,
                  "transformations": tableInfo[i].transformations,
                  "field": tableInfo[i].propName.field,
                  "defaultValue": tableInfo[i].defaultVal,
                  "index": tableInfo[i].propName.index,
                  "instance": tableInfo[i].propName.instance,
                  "isRequired": tableInfo[i].propName.isRequired
                };
              } else {
                mappingDetails.mappingInfo[i] = {
                  "field": tableInfo[i].tableName+"s",
                  "values": [{
                    "userFieldName": tableInfo[i].columnName,
                    "transformations": tableInfo[i].transformations,
                    "field": tableInfo[i].propName.field,
                    "defaultValue": tableInfo[i].defaultVal,
                    "index": tableInfo[i].propName.index,
                    "instance": tableInfo[i].propName.instance,
                    "isRequired": tableInfo[i].propName.isRequired
                  }]
                };
              }
            };
            saveMapping(mappingDetails);
            //reset newmap
            $scope.newMap = false;
            //get list
            //getMappingList(1);
          } else {
            growl.error("Please map all required fields before trying to save mapping");
          }        
        } else {
          growl.error("There are no mapping details to save");
        }
      } else {
        $scope.submitted = true;
        growl.error("Please provide mapping name before saving");
      }
    }

    $scope.newMapping = function () {
      $scope.newMap = true;
    }

    $scope.fourthStep = function (selectedMapping) {
      $scope.badge.step = "four";
      getMappingJson(1, selectedMapping._id);
    }

    _scope.init();
	}]);

//directives
app.directive('cellHighlight', function() {
    return {
      restrict: 'C',
      link: function postLink(scope, iElement, iAttrs) {
        iElement.find('td')
          .mouseover(function() {
            $(this).parent('tr').css('opacity', '0.7');
          }).mouseout(function() {
            $(this).parent('tr').css('opacity', '1.0');
          });
      }
    };
  });

app.directive('context', [

    function() {
      return {
        restrict: 'A',
        scope: '@&',
        compile: function compile(tElement, tAttrs, transclude) {
          return {
            post: function postLink(scope, iElement, iAttrs, controller) {
              var ul = $('#' + iAttrs.context),
                last = null;

              ul.css({
                'display': 'none'
              });
              $(iElement).bind('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                 ul.css({
                  position: "fixed",
                  display: "block",
                  left: event.clientX + 'px',
                  top: event.clientY + 'px'
                });
                last = event.timeStamp;
              });

              $(document).click(function(event) {
                var target = $(event.target);
                if (!target.is(".popover") && !target.parents().is(".popover")) {
                  if (last === event.timeStamp)
                    return;
                  ul.css({
                    'display': 'none'
                  });
                }
              });
            }
          };
        }
      };
    }
  ]);

//directives
app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});

//filters
app.filter('smallize', function() {
  return function(input, scope) {
    if (input!=null)
    return input.substring(0,1).toLowerCase()+input.substring(1);
  }
});

app.controller('confirmationModalInstanceCtrl', function($scope, 
  $modalInstance, table_scope, row_no) {
    $scope.selectedTable = table_scope;
    $scope.num = row_no;
    $scope.acceptDelete = function (){
      var cnfDelete = true;
      $modalInstance.close(cnfDelete);
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});
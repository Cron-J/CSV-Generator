'use strict';

/* Controller */

app
  .controller('mainCtrl',['$scope', '$rootScope', '$http', 'growl', '$location', '$timeout', 
     '$filter', '$upload', '$modal', '$log','$route',
    function($scope, $rootScope, $http, growl, $location, $timeout, $filter, $upload,  
     $modal, $log,$route){
    var _scope = {};
    $scope.badge={}
    $scope.clear={};
    /*object instanciation and load first tab */
    _scope.init = function(){
      $scope.firstStep();    // load first tab
      $scope.resultXls = {};
      defaultBtn();          
      defaultFilePreviewSettings();  // load default setting for file preview
    }
    $scope.clearData=function(){
      $route.reload();
    }

    var defaultBtn = function () {
      $scope.defaultVal={
        name:"defaultValue",
        value:null
      }
    }
    /*load default setting for file preview */
    var defaultFilePreviewSettings = function() {
      $scope.fileStyle = {
        "includeHeader":true,
        // "dateFormat":'',
        // "numberFormat":'',
        "delimeterFormat":',' 
      }
    }
/*-----------------------------------Transformaton Operation------------------------------*/
    var rowIndex;
    var transValue;
    $scope.transInfo={pushable:[],transVal:''};
    $scope.clicked = '';
    var contextIndex;

    /*it load particular row transformation data and send to garafana library*/
    $scope.saveIndex=function(ind,type){
      rowIndex=ind;
      if($scope.tableData[rowIndex].transformations && $scope.tableData[rowIndex].transformations.length>=0){
        $scope.transInfo.pushable=$scope.tableData[rowIndex].transformations;
        if(type=='edit')
          $rootScope.$broadcast("edittransformation",$scope.transInfo.pushable);
        else{
          $rootScope.$broadcast("transformation",$scope.transInfo.pushable);
        }
      }
      else{
        $scope.tableData[rowIndex].transformations=[];
        $scope.transInfo.pushable=$scope.tableData[rowIndex].transformations;
        if(type=='edit')
          $rootScope.$broadcast("edittransformation",$scope.transInfo.pushable);
        else{
          $rootScope.$broadcast("transformation",$scope.transInfo.pushable);
        }
      }
    }
    /*it save transformation data to datatable object*/
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
      // $scope.property = {
      //   "productPropertyList": [],
      //   "pricePropertyList": [],
      //   "attributePropertyList": [],
      //   "prPropertyList": [],
      //   "cpPropertyList": [],
      //   "cgaPropertyList": []
      // };
      $http.get('/getAttributes') 
        .success(function(data){
          if(data){
            $scope.property={product:[]};
            $scope.attributeList=data;
            angular.forEach(data.attributes,function(value,key){
                if(!value.values){
                  $scope.property['product'].push(value);
                }
                else{
                  $scope.property[value.field]=value.values;
                }
            })
            $scope.tableLists={};
            angular.forEach($scope.property,function(value,key){
              $scope.tableLists[key]=[];
            })
            // var k = 0;
            // for (var i = 0; i < data.length; i++) {
            //   if(!data[i].values){
            //     $scope.property.productPropertyList[k] = data[i];
            //     k++;
            //   }
            //   if(data[i].field == 'prices'){
            //     $scope.property.pricePropertyList = data[i].values;
            //   }
            //   if(data[i].field == 'attributeValues'){
            //     $scope.property.attributePropertyList = data[i].values;
            //   }
            //   if(data[i].field == 'productRelations'){
            //     $scope.property.prPropertyList = data[i].values;
            //   }
            //   if(data[i].field == 'contractedProducts'){
            //     $scope.property.cpPropertyList = data[i].values;
            //   }
            //   if(data[i].field == 'classificationGroupAssociations'){
            //     $scope.property.cgaPropertyList = data[i].values;
            //   }
            // };
          }
        })
        .error(function(){
          growl.error("Unable to get attributes");
        });
    }

    var getTableData = function (table){

        $scope.propertyList = $scope.property[table];
        // switch (table) {
        //   case 'product':
        //     $scope.propertyList = $scope.property.productPropertyList;
        //     break;
        //   case 'prices':
        //     $scope.propertyList = $scope.property.pricePropertyList;
        //     break;
        //   case 'attributeValues':
        //     $scope.propertyList = $scope.property.attributePropertyList;
        //     break;
        //   case 'productRelations':
        //     $scope.propertyList = $scope.property.prPropertyList;
        //     break;
        //   case 'contractedProducts':
        //     $scope.propertyList = $scope.property.cpPropertyList;
        //     break;
        //   case 'classificationGroupAssociations':
        //     $scope.propertyList = $scope.property.cgaPropertyList;
        //     break;
        // }
        if($scope.propertyList){
          var modifiedList = $scope.propertyList;
          $scope.propertyList = [];
          for(var i = 0; i < modifiedList.length ; i++){  
            $scope.propertyList[i] = {};
            $scope.propertyList[i] = modifiedList[i];
            /*selected value get unselect using this so commented*/
            //$scope.propertyList[i].isSelect = false;
          }
          mappedPropColumns(table);
        } 
        
    }

    $scope.selectTable = function (tname, rowNo, list) {
      //var otname = tname.slice(0,tname.length);
      getTableData(tname);
      $scope.selectedTable = tname;
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

      $("option:selected").not("#SelectId option:selected").removeAttr("selected");
    }

    $scope.mapAttribute = function () {
      if($scope.selectedColumn){
        if(($scope.selectedColumn == "gross_price") || ($scope.selectedColumn == "retail_price") 
          || ($scope.selectedColumn == "grossprice") || ($scope.selectedColumn == "retailprice")){
          $scope.pickedTable = "prices";
          $scope.passingList = $scope.tableLists.prices;
        } else {
          $scope.pickedTable = "attributeValues";
          $scope.passingList = $scope.tableLists.attributeValues;
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
                if($scope.pickedTable == "prices"){
                  $scope.tableData[i].rowId = $scope.tableLists.prices.length;
                  for(var q = 0 ; q < $scope.property.prices.length ; q++) {
                    if( $scope.property.prices[q].field == 'priceUnit'){
                      $scope.tableData[i].propName = {};
                      $scope.tableData[i].propName = $scope.property.prices[q];
                    }
                  }
                } else {
                  $scope.tableData[i].rowId = $scope.tableLists.attributeValues.length;
                  for(var q = 0 ; q < $scope.property.attributeValues.length ; q++){
                    if( $scope.property.attributeValues[q].field == 'attribute'){
                      $scope.tableData[i].propName = {};
                      $scope.tableData[i].propName = $scope.property.attributeValues[q];
                    }
                  }
                }
              }
              if(j == k-1){
                $scope.tableData[j] = angular.copy(dummy);
                $scope.tableData[j].columnName = $scope.selectedColumn;
                $scope.tableData[j].tableName = $scope.pickedTable;
                if($scope.pickedTable == "prices"){
                  $scope.tableData[j].rowId = $scope.tableLists.prices.length;
                  for(var q=0 ; q < $scope.property.prices.length ; q++){
                    if( $scope.property.prices[q].field == 'priceTypeId'){
                      $scope.tableData[j].propName = {};
                      $scope.tableData[j].propName = $scope.property.prices[q];
                    }
                  }
                } else {
                  $scope.tableData[j].rowId = $scope.tableLists.attributeValues.length;
                  for(var q=0 ; q < $scope.property.attributeValues.length; q++){
                    if( $scope.property.attributeValues[q].field == 'value'){
                      $scope.tableData[j].propName = {};
                      $scope.tableData[j].propName = $scope.property.attributeValues[q];
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

    $scope.changeFormat=function(){

      $scope.uploadedDataDump=angular.copy($scope.unformatedData);
      $scope.uploadedDataDump.headers = splitter($scope.uploadedDataDump.headers,$scope.fileStyle.delimeterFormat);
      $scope.uploadedDataDump.rowOne = splitter($scope.uploadedDataDump.rowOne,$scope.fileStyle.delimeterFormat);
      $scope.uploadedDataDump.rowTwo = splitter($scope.uploadedDataDump.rowTwo,$scope.fileStyle.delimeterFormat);
      $scope.uploadedData = angular.copy($scope.uploadedDataDump);

      $scope.dupUploadedData=angular.copy($scope.uploadedData);

      $scope.dupUploadedData.rowOne = changeDateFormat($scope.dupUploadedData.rowOne, $scope.fileStyle.dateFormat);
      $scope.dupUploadedData.rowTwo = changeDateFormat($scope.dupUploadedData.rowTwo, $scope.fileStyle.dateFormat);
      $scope.dupUploadedData.rowOne = changeNumberFormat($scope.dupUploadedData.rowOne, $scope.fileStyle.numberFormat);
      $scope.dupUploadedData.rowTwo = changeNumberFormat($scope.dupUploadedData.rowTwo, $scope.fileStyle.numberFormat);
      // var list = {
      //     "list0" : $scope.dupUploadedData.headers.join(),
      //     "list1" : $scope.dupUploadedData.rowOne.join(),
      //     "list2" : $scope.dupUploadedData.rowTwo.join()
      //   }
      // $scope.dupUploadedData.headers = changeDelimiterFormat(list.list0, $scope.fileStyle.delimeterFormat);
      // loadingColumns($scope.dupUploadedData.headers);
      // $scope.dupUploadedData.rowOne = changeDelimiterFormat(list.list1, $scope.fileStyle.delimeterFormat);
      // $scope.dupUploadedData.rowTwo = changeDelimiterFormat(list.list2, $scope.fileStyle.delimeterFormat);
      loadingColumns($scope.dupUploadedData.headers);
    }

    // $scope.selectedDateFormat = function (format) {

    //   var list1 = $scope.dupUploadedData.rowOne;
    //   var list2 = $scope.dupUploadedData.rowTwo;
    //   $scope.dupUploadedData.rowOne = changeDateFormat(list1, format);
    //   $scope.dupUploadedData.rowTwo = changeDateFormat(list2, format);
    // }

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

    // $scope.selectedNumberFormat = function (format) {
    //   var list1 = $scope.dupUploadedData.rowOne;
    //   var list2 = $scope.dupUploadedData.rowTwo;
    //   $scope.dupUploadedData.rowOne = changeNumberFormat(list1, format);
    //   $scope.dupUploadedData.rowTwo = changeNumberFormat(list2, format);
    // }

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

    // $scope.selectedDelimiterFormat = function (format) {
    //   var list = {
    //       "list0" : $scope.dupUploadedData.headers.join(),
    //       "list1" : $scope.dupUploadedData.rowOne.join(),
    //       "list2" : $scope.dupUploadedData.rowTwo.join()
    //     }
    //   $scope.dupUploadedData.headers = changeDelimiterFormat(list.list0, format);
    //   loadingColumns($scope.dupUploadedData.headers);
    //   $scope.dupUploadedData.rowOne = changeDelimiterFormat(list.list1, format);
    //   $scope.dupUploadedData.rowTwo = changeDelimiterFormat(list.list2, format);
    // }

    // var changeDelimiterFormat = function (list, format) {
    //   var dump;
    //   if(format == '.' && list)
    //       dump = list.split(".");
    //   else 
    //       dump = list.split(",");
    //   return dump;
    // }

    $scope.resetData = function () {
      $scope.dupUploadedData = angular.copy($scope.uploadedData);
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
          $scope.unformatedData=angular.copy(data);
          
          $scope.secondStep();
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
      //$scope.secondStep(); 
      
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
      if(clength >= reqFieldList.length)
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
      if(!$scope.edit){
        $http.get('/getMappingList/'+ tenantId)
        .success(function(data){
          $scope.mappingList = data;
          angular.forEach($scope.mappingList,function(value,key){
            if(value.mappingName==$scope.map.name){
              $scope.selectedMapping=value;
            }
          })
        })
        .error(function(err){
          growl.error("Unable to get mapping list");
        });
      }
      else{
        $scope.edit=false;
      }
    }

    //getMappedJson
    var getMappingJson = function (tenantId, mappingId) {
      $http.get('/getTestMappingData/'+tenantId+'/'+mappingId)
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

      
      // $scope.tableLists = {
      //   "PricesList" : [],
      //   "ProductAttributeValuesList" : [],
      //   "ClassificationAssignmentsList" : [],
      //   "ProductRelationsList" : [],
      //   "ContractedProductList" : []
      // }
    } 

    $scope.secondStep = function () {
      $scope.badge.step = "two";
      getPropertyList();
      $scope.changeFormat();
      //loadingColumns($scope.uploadedData.headers);
    }

    function splitter(data,splittype) {
      return data.split(splittype);
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
    $scope.edit=false;
    $scope.editMapping = function (map) {

      $scope.edit=true;
      $scope.badge.step = "three";
      $scope.isMapSaved=false;
      $http.get('/getMapping/'+map.tenantId+'/'+map._id)
        .success(function(data){
          $scope.tableData={};
          $scope.uploadedData={};
          $scope.map={};
          $scope.tableData=data[0].mappingInfo;
          $scope.mapid=data[0]._id;
          /*this is hardcode but in feature it will dynamic*/
          
          angular.forEach($scope.tableData,function(val,key){
            
            val.propName={};
            if(val.values.length==0){
              val.tableName = 'product';
              val.propName.field = val.field;
              val.propName.index = val.index;
              val.propName.instance = val.instance;
              val.propName.isRequired = val.isRequired;
              val.columnName = val.userFieldName;
              val.defaultVal = val.defaultValue;
              delete val.field;
              delete val.index;
              delete val.instance;
              delete val.isRequired;
              delete val.userFieldName;
              
            }
            else{
              val.tableName = val.field;
              val.propName.field = val.values[0].field;
              val.propName.index = val.values[0].index;
              val.propName.instance = val.values[0].instance;
              val.propName.isRequired = val.values[0].isRequired;
              val.transformations = val.values[0].transformations;
              val.defaultVal = val.values[0].defaultValue;
              val.columnName = val.values[0].userFieldName;
              delete val.field;
              delete val.values;
      
            }
            $scope.saveIndex(key,'edit');
            val.isEdit=true;
             if(val.defaultVal)
                val.quotes=true;
          })
          $scope.uploadedData.fileName=data[0].fileName;
          $scope.map.name=data[0].mappingName;
          $scope.fileViewFormats=data[0].delimeter;
          
          
        })
      
    }

    var saveEditedMapping=function (data) {

      $http.put('/updateMapping/'+$scope.mapid,data).then(function(data){
          $scope.mapid=null;
          $scope.isMapSaved = true;
          growl.success("Mapping has been saved successfully");
          getMappingList(1);
      })
      .catch(function(err){
          console.log('error',err);
      })
    }


    $scope.saveMappingStep = function (map, tableInfo) {
      if(map.name){
        if(tableInfo.length > 0){
          $scope.submitted = false;
          var valid = checkMapping(tableInfo);
          if(valid == true){
            var mappingDetails = {};
           // mappingDetails._id = tableInfo._id :
            mappingDetails.tenantId = 1;
            mappingDetails.fileName = $scope.uploadedData.fileName;
            mappingDetails.mappingName = map.name;
            mappingDetails.delimeter = $scope.fileViewFormats;
            mappingDetails.mappingInfo = [];
            for (var i = 0; i < tableInfo.length; i++) {
             // if(!tableInfo[i].isEdit){
                if(tableInfo[i].tableName == 'product'){
                   mappingDetails.mappingInfo[i] = {
                    "userFieldName": tableInfo[i].columnName,
                    "transformations":tableInfo[i].transformations,
                    "field": tableInfo[i].propName.field,
                    "defaultValue": tableInfo[i].defaultVal,
                    "index": tableInfo[i].propName.index,
                    "instance": tableInfo[i].propName.instance,
                    "isRequired": tableInfo[i].propName.isRequired
                  };
                } else {
                  mappingDetails.mappingInfo[i] = {
                    "field": tableInfo[i].tableName,
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

             // }
              // else{
              //     mappingDetails.mappingInfo[i] = tableInfo[i];
              //     mappingDetails.mappingInfo[i].field=mappingDetails.mappingInfo[i].propName.field;
              //     mappingDetails.mappingInfo[i].index=mappingDetails.mappingInfo[i].propName.index;
              //     mappingDetails.mappingInfo[i].instance=mappingDetails.mappingInfo[i].propName.instance;
              //     mappingDetails.mappingInfo[i].isRequired=mappingDetails.mappingInfo[i].propName.isRequired;
              //     delete mappingDetails.mappingInfo[i].propName;
              //   }
            };
            if($scope.mapid){
              saveEditedMapping(mappingDetails);
            }
            else{
              saveMapping(mappingDetails);
            }
            
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
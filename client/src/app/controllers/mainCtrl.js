'use strict';

/* Controller */

app
	.controller('mainCtrl',['$scope', '$rootScope', '$http', 'growl', '$location', '$timeout', 
     '$filter', '$upload', 'XLSXReaderService', '$modal', '$log',
		function($scope, $rootScope, $http, growl, $location, $timeout, $filter, $upload,  
      XLSXReaderService, $modal, $log){
		var _scope = {};
    $scope.badge={}
		_scope.init = function(){
      $scope.firstStep();
      $scope.resultXls = {};
      $scope.defaultVal={
        val:null
      }
      $scope.fileStyle = {
        "isHeader":true,
        "datePattern":'dd-MM-yyyy',
        "numberPattern":'',
        "decimalSeparator":',' 
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
          //delete $scope.transInfo.pushable[i].def;
          //delete $scope.transInfo.pushable[i].params;
          //delete $scope.transInfo.pushable[i].added;
      }
      //transValue=$scope.transInfo.transVal
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

    $scope.onLoadMap = function () {
      var list = getTableData('Prices');
      addRows(list, 'Prices');
      list = getTableData('ProductAttributeValues');
      addRows(list, 'ProductAttributeValues');
      list = getTableData('ClassificationAssignment');
      addRows(list, 'ClassificationAssignment');
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
              // console.log('$scope.propertyList1', $scope.propertyList);
              var modifiedList = $scope.propertyList;
              $scope.propertyList = [];
              for(var i = 0; i < modifiedList.length ; i++){  
                $scope.propertyList[i] = {};
                $scope.propertyList[i] = modifiedList[i];
                $scope.propertyList[i].isSelect = false;
              }
              // console.log('$scope.propertyList', $scope.propertyList);
              mappedPropColumns(originalTName);
            }
          } 
        })
        .error(function(){
          growl.error("Unable to get attributes");
        });
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
      $scope.passingList.length ++;
      for(var i = 0; i < $scope.passingList.length ; i++){   
          $scope.passingList[i] = {};
          $scope.passingList[i].table = $scope.pickedTable; 
          $scope.passingList[i].rowId = i+1;     
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
                        "tableName": null, "aIndex": 0, "quotes": false , "rowId":0,"transformations":[]};
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
      if(($scope.selectedColumn == "gross_price") || ($scope.selectedColumn == "retail_price") 
        || ($scope.selectedColumn == "grossprice") || ($scope.selectedColumn == "retailprice")){
        $scope.pickedTable = "Price";
        $scope.passingList = $scope.tableLists.PricesList;
      } else {
        $scope.pickedTable = "ProductAttributeValue";
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
              $scope.tableData[i].quotes = true;
              if($scope.tableData[i].tableName == $scope.pickedTable){
                $scope.tableData[i].aIndex++;
              }
              if($scope.pickedTable == "Price"){
                $scope.tableData[i].rowId = $scope.tableLists.PricesList.length;
                $scope.tableData[i].propName = {};
                $scope.tableData[i].propName.field = 'priceUnit';
                $scope.tableData[i].propName.reference = {};
                $scope.tableData[i].propName.index = null;
              } else {
                $scope.tableData[i].rowId = $scope.tableLists.ProductAttributeValuesList.length;
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
              if($scope.pickedTable == "Price"){
                $scope.tableData[j].rowId = $scope.tableLists.PricesList.length;
                $scope.tableData[j].propName = {};
                $scope.tableData[j].propName.field = 'priceTypeId';
                $scope.tableData[j].propName.reference = {};
                $scope.tableData[j].propName.index = null;
              } else {
                $scope.tableData[j].rowId = $scope.tableLists.ProductAttributeValuesList.length;
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
      var list1 = angular.copy($scope.orginalImportedDatar1);
      var list2 = angular.copy($scope.orginalImportedDatar2);
      $scope.importedDatar1 = changeDateFormat(list1, format);
      $scope.importedDatar2 = changeDateFormat(list2, format);
    }

    var changeDateFormat = function (list, format) {
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

    $scope.selectedNumberFormat = function (format) {
      var list1 = angular.copy($scope.orginalImportedDatar1);
      var list2 = angular.copy($scope.orginalImportedDatar2);
      $scope.importedDatar1 = changeNumberFormat(list1, format);
      $scope.importedDatar2 = changeNumberFormat(list2, format);
    }

    var changeNumberFormat = function (list, format) {
      for (var i = 0; i < list.length; i++) {
        if(!isNaN(list[i])) {
          if(format == '#,##'){
            var str = list[i].toString().split('.');
            if (str[0].length >= 3) {
                str[0] = str[0].replace(/(\d)(?=(\d{2})+$)/g, '$1,');
            }
            // if (str[1] && str[1].length >= 3) {
            //     str[1] = str[1].replace(/(\d{2})/g, '$1 ');
            // }
             list[i] = str.join('.');
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
            if(list[i].toString().length > 5){
              var dec = (list[i] % 100000);
              list[i] = (list[i] / 100000);
              var str = list[i].toString();
              var index = str.length-2;
              str = str.slice(0,index)+ "," + str.slice(index);  
              list[i] = str;  
            }
          }
        }
      }
      return list;
    }

    $scope.startRead = function(files, option) {
      // $scope.secondStep();
      $scope.columnShowList = [];
      $scope.selectedFiles = files;
      if(option == '.')
        var file = $scope.selectedFiles[0];
      else 
        var file = files[0];
      if (file) {
        var name = file.name.split(".");
        if(name[name.length - 1] == "csv" ){
          $scope.uploadedFileType = 'csv';
          $scope.selectedOption = option;
          getData(file);
        }
        else if(name[name.length - 1] == "xlsx"){
          $scope.uploadedFileType = 'xlsx';
          fileChanged(files);
          updateJSONString(); 
          showPreviewChanged();
        } 
        else{
          $scope.uploadedFileType = 'xls';
          readXls(file);
          // console.log('entered file type is otherthan csv or xls');
        }
      }
    }

    //reading csv file
    var getData = function (readFile) {
      var reader = new FileReader();
      reader.readAsText(readFile);
      reader.onload = processData;
    }

    var processData = function (allText) {
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
      $scope.importedData = tableData;
      if($scope.selectedOption == '.'){
        if(headers != undefined)
          $scope.columnList = headers.split(".");
        if(dumpTable[1] != undefined)
          $scope.importedDatar1 = dumpTable[1].split(".");
        if(dumpTable[2] != undefined)
          $scope.importedDatar2 = dumpTable[2].split(".");
          $scope.orginalImportedDatar1 =dumpTable[1].split(".");
          $scope.orginalImportedDatar2 = dumpTable[2].split(".");
      } else {
        if(headers != undefined)
          $scope.columnList = headers.split(",");
        if(dumpTable[1] != undefined)
          $scope.importedDatar1 = dumpTable[1].split(",");
        if(dumpTable[2] != undefined)
          $scope.importedDatar2 = dumpTable[2].split(",");
        $scope.orginalImportedDatar1 = dumpTable[1].split(",");
        $scope.orginalImportedDatar2 = dumpTable[2].split(",");
      }
      // loading columns
      loadingColumns();
      $scope.selectedDateFormat('dd-MM-yyyy');
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

    // reading xls file
    var readXls = function (readFile) {
      var reader = new FileReader();
      var name = readFile.name;
      reader.onload = function(e) {
        var data = e.target.result;
        /* if binary string, read with type 'binary' */
        var workbook = XLS.read(data, {type: 'binary'});
        /* DO SOMETHING WITH workbook HERE */
        var result = {};
        var obj;
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (roa) {
                $scope.resultXls = roa;
            }
        }); 
        $scope.columnList = $scope.resultXls.headerColNames;
        $scope.importedDatar1 = $scope.resultXls.rowOne;
        $scope.importedDatar2 = $scope.resultXls.rowTwo;
        $scope.orginalImportedDatar1 = $scope.resultXls.rowOne;
        $scope.orginalImportedDatar2 = $scope.resultXls.rowTwo;
        loadingColumns();
        $scope.selectedDateFormat('dd-MM-yyyy');   
      }
        reader.readAsBinaryString(readFile);
        $scope.secondStep();
    }

    //reading xlsx file
    $scope.showPreview = false;
    $scope.showJSONPreview = true;
    $scope.json_string = "";

    var fileChanged = function(files) {
        $scope.isProcessing = true;
        $scope.sheets = [];
        $scope.excelFile = files[0];
        XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function(xlsxData) {
            $scope.sheets = xlsxData.sheets;
            $scope.isProcessing = false;
        });
    }

    var updateJSONString = function() {
      $scope.showPreview = true;
      $scope.selectedSheetName = 'Sheet1'
      $scope.json_string = JSON.stringify($scope.sheets[$scope.selectedSheetName], null, 2);
      $scope.secondStep();
    }

    var showPreviewChanged = function() {
        if ($scope.showPreview) {
            $scope.showJSONPreview = false;
            $scope.isProcessing = true;
            XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview).then(function(xlsxData) {
                $scope.sheets = xlsxData.sheets;
                $scope.columnList = $scope.sheets.Sheet1.data[0];
                $scope.orginalImportedDatar1 = $scope.sheets.Sheet1.data[1];
                $scope.orginalImportedDatar2 = $scope.sheets.Sheet1.data[2];
                $scope.importedDatar1 = $scope.sheets.Sheet1.data[1];
                $scope.importedDatar2 = $scope.sheets.Sheet1.data[2];
                loadingColumns();
                $scope.selectedDateFormat('dd-MM-yyyy');
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
            $scope.isMapSaved = true;
            growl.success("Mapping has been saved successfully");
          })
          .error(function(){
            growl.error("Unable to save Mapping");
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
      $scope.selectTable('Product');
    }

    $scope.thirdStep = function (info) {
      $scope.badge.step = "three";
      if($scope.tableData == undefined){
        $scope.tableData = [];
      }
      if($scope.map == undefined){
        $scope.map = {
          name:null
        }
      }
    }

    $scope.saveMappingStep = function (map, tableInfo) {
      if(map.name){
        if(tableInfo.length > 0){
          $scope.submitted = false;
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
                "transformations": tableInfo[i].transformations,
                "fieldDetail": tableInfo[i].propName
              };
            };
            // console.log('mappingDetails', mappingDetails);
            saveMapping(mappingDetails);
            //reset newmap
            $scope.newMap = false;
          } else {
            growl.error("Please map all required fields before trying to save mapping");
          }        
        } else {
          growl.error("There are no mapping details to save");
        }
      } else {
        $scope.submitted = true;
      }
    }

    $scope.newMapping = function () {
      $scope.newMap = true;
    }

    $scope.fourthStep = function () {
      $scope.badge.step = "four";
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
              //$(iElement).click(function(event) {
              //  ul.css({
              //    position: "fixed",
              //    display: "block",
              //    left: event.clientX + 'px',
              //    top: event.clientY + 'px'
              //  });
              //  last = event.timeStamp;
              //});

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
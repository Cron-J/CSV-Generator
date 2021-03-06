'use strict';

/* Controller */
app.controller('mainCtrl', ['$scope', '$rootScope', '$http', 'growl', '$location', '$timeout',
        '$filter', '$upload', '$modal', '$log', '$route', 'MapperService', '$q',
        function($scope, $rootScope, $http, growl, $location, $timeout, $filter, $upload,
            $modal, $log, $route, MapperService, $q) {
            var _scope = {};
            $scope.badge = {}
            $scope.clear = {};
            $scope.setting = {isBackToSecondStep : false};
            

            /*object instanciation and load first tab */
            _scope.init = function() {
                $scope.firstStep(); // load first tab
                $scope.resultXls = {};
                defaultBtn();
                defaultFilePreviewSettings(); // load default setting for file preview
                MapperService.getConfigData()
                    .then(function(data){
                        $scope.apiUrl = data.data;
                        getSynonyms();
                    }).catch(function(data){
                        growl.error('Something went wrong in configuring app.');
                    })
                    
                
            }
            function getSynonyms (){
                 MapperService.getSynonyms($scope.apiUrl)
                        .then(function(data){
                            $scope.synonyms = data.data;
                        }).catch(function(data){
                            growl.error('Something went wrong in fetching synonyms data.')
                        })
            }

            $scope.$on('redirectToMappingEditor', function (event, data){
                $scope.clearData();
            })

            $scope.$on('editMapping', function(event, data){
                $scope.editMap();
            })
            
            
            $scope.clearData = function(callback) {
                $route.reload();
            }

            var defaultBtn = function() {
                    $scope.defaultVal = {
                        name: "defaultValue",
                        value: null
                    }
                }
                /*load default setting for file preview */
            var defaultFilePreviewSettings = function() {
                    $scope.fileStyle = {
                        "includeHeader": true, 
                    }
                }
                /*-----------------------------------Transformaton Operation------------------------------*/
            var rowIndex;
            var transValue;
            $scope.transInfo = {
                pushable: [],
                transVal: ''
            };
            $scope.clicked = '';
            var contextIndex;

            /*it load particular row transformation data and send to garafana library*/
            $scope.saveIndex = function(ind, type) {
                    rowIndex = ind;
                    if ($scope.tableData[rowIndex].transformations && $scope.tableData[rowIndex].transformations.length >= 0) {
                        $scope.transInfo.pushable = $scope.tableData[rowIndex].transformations;
                        if (type == 'edit')
                            $rootScope.$broadcast("edittransformation", $scope.transInfo.pushable);
                        else {
                            $rootScope.$broadcast("transformation", $scope.transInfo.pushable);
                        }
                    } else {
                        $scope.tableData[rowIndex].transformations = [];
                        $scope.transInfo.pushable = $scope.tableData[rowIndex].transformations;
                        if (type == 'edit')
                            $rootScope.$broadcast("edittransformation", $scope.transInfo.pushable);
                        else {
                            $rootScope.$broadcast("transformation", $scope.transInfo.pushable);
                        }
                    }
                }
                /*it save transformation data to datatable object*/
            $scope.saveTransformationInfo = function() {
                for (var i = 0; i < $scope.transInfo.pushable.length; i++) {
                    delete $scope.transInfo.pushable[i].def.category;
                }
                $scope.tableData[rowIndex].transformations = $scope.transInfo.pushable;
                $scope.tableData[rowIndex].transVal = angular.copy($scope.transInfo.transVal);

            };

            //mapping
            $scope.selectColumn = function(info) {
                $scope.selectedColumn = info;
            }

            //automatically mapped coloumns
            $scope.autoMap = function() {
                if ($scope.propertyList) {
                    for (var j = 0; j < $scope.columnShowList.length; j++) {
                        for (var i = 0; i < $scope.propertyList.length; i++) {
                            if ($scope.propertyList[i].propName == $scope.columnShowList[j].colName) {
                                $scope.columnShowList[j].isSelect = true;
                                $scope.propertyList[i].isSelect = true;
                            }
                        }
                    }
                }
            }

            $scope.enteredDefaultVal = function(info) {
                $scope.selectedDefaultVal = info;
            }



            var getPropertyList = function() {

                /*MapperService.getPropertyList($scope.apiUrl)
                    .then(function(data) {
                        console.log('daaaaaaaaaaaaaaaaaaaaaa');*/
                        var tst = [
    {
        "field": "tenantId",
        "index": true,
        "isRequired": true,
        "instance": "String"
    },
    {
        "field": "productId",
        "index": true,
        "isRequired": true,
        "instance": "String"
    },
    {
        "field": "supplierId",
        "index": true,
        "instance": "String"
    },
    {
        "field": "statusId",
        "index": null,
        "instance": "String"
    },
    {
        "field": "mfgProductId",
        "index": null,
        "instance": "String"
    },
    {
        "field": "mfgProductName",
        "index": null,
        "instance": "String"
    },
    {
        "field": "manufactererId",
        "index": null,
        "instance": "String"
    },
    {
        "field": "manufactererName",
        "index": null,
        "instance": "String"
    },
    {
        "field": "extProductId",
        "index": null,
        "instance": "String"
    },
    {
        "field": "productIdExtension",
        "index": null,
        "instance": "String"
    },
    {
        "field": "unitOfMeasureId",
        "index": null,
        "instance": "String"
    },
    {
        "field": "salesUnitOfMeasureId",
        "index": null,
        "instance": "String"
    },
    {
        "field": "keywords",
        "index": null,
        "instance": "String"
    },
    {
        "field": "ean",
        "index": null,
        "instance": "String"
    },
    {
        "field": "isMainProdLine",
        "index": null
    },
    {
        "field": "isForSales",
        "index": null
    },
    {
        "field": "isSpecialOffer",
        "index": null
    },
    {
        "field": "isStocked",
        "index": null
    },
    {
        "field": "isPunchout",
        "index": null
    },
    {
        "field": "isConfigurable",
        "index": null
    },
    {
        "field": "validFrom",
        "index": null
    },
    {
        "field": "validTo",
        "index": null
    },
    {
        "field": "classificationGroupAssociations",
        "values": [
            {
                "field": "classificationId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "classificationGroupId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "orderNo",
                "index": null,
                "instance": "Number"
            }
        ]
    },
    {
        "field": "attributeValues",
        "values": [
            {
                "field": "attribute",
                "index": null,
                "instance": "String"
            },
            {
                "field": "value",
                "index": null,
                "instance": "String"
            },
            {
                "field": "languageId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "orderNro",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "statusId",
                "index": null,
                "instance": "String"
            }
        ]
    },
    {
        "field": "contractedProducts",
        "values": [
            {
                "field": "contractId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "altExtProductId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "extClassificationId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "extClassificationGroupId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "descShort",
                "index": null,
                "instance": "String"
            },
            {
                "field": "descLong",
                "index": null,
                "instance": "String"
            },
            {
                "field": "extGLAccountId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "priceQuantity",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "quantityInterval",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "maxQuantity",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "minQuantity",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "leadtimeInDays",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "salesUnitOfMeasureId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "timePeriod",
                "index": null,
                "instance": "String"
            },
            {
                "field": "visibility",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "unitOfMeasureId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "cost",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "currencyId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "ammount",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "statusDate",
                "index": null
            },
            {
                "field": "discount",
                "index": null,
                "instance": "Number"
            }
        ]
    },
    {
        "field": "prices",
        "values": [
            {
                "field": "contractId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "statusId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "currencyId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "priceTypeId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "netPrice",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "grossPrice",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "fixNetPrice",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "listPrice",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "validFromQuantity",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "validFrom",
                "index": null
            },
            {
                "field": "validTo",
                "index": null
            },
            {
                "field": "unitOfMeasureId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "productIdExtensionForUoM",
                "index": null,
                "instance": "String"
            },
            {
                "field": "priceUnit",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "description",
                "index": null,
                "instance": "String"
            },
            {
                "field": "vatPercentage",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "isPreferred",
                "index": null
            }
        ]
    },
    {
        "field": "productRelations",
        "values": [
            {
                "field": "relatedProductId",
                "index": null
            },
            {
                "field": "descriptions",
                "index": null
            },
            {
                "field": "typeId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "validFrom",
                "index": null
            },
            {
                "field": "validTo",
                "index": null
            },
            {
                "field": "quantity",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "statusId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "seqNo",
                "index": null,
                "instance": "String"
            },
            {
                "field": "udxText1",
                "index": null,
                "instance": "String"
            },
            {
                "field": "udxText2",
                "index": null,
                "instance": "String"
            },
            {
                "field": "udxText3",
                "index": null,
                "instance": "String"
            },
            {
                "field": "udxNum1",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "udxNum2",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "udxNum3",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "udxSortKey1",
                "index": null,
                "instance": "String"
            },
            {
                "field": "udxSortKey2",
                "index": null,
                "instance": "String"
            },
            {
                "field": "udxSortKey3",
                "index": null,
                "instance": "String"
            },
            {
                "field": "syncTypeId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "isMandatory",
                "index": null
            },
            {
                "field": "selectionGroupId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "isDefaultSelected",
                "index": null
            }
        ]
    },
    {
        "field": "documents",
        "values": [
            {
                "field": "path",
                "index": null,
                "instance": "String"
            },
            {
                "field": "documentViewTypeId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "orderNo",
                "index": null,
                "instance": "Number"
            },
            {
                "field": "languageId",
                "index": null,
                "instance": "String"
            },
            {
                "field": "description",
                "index": null,
                "instance": "String"
            },
            {
                "field": "validFrom",
                "index": null
            },
            {
                "field": "validTo",
                "index": null
            }
        ]
    }
];
    var data = {'data':{'attributes':tst,'modelName':"product"}}; 
                        if (data.data) {
                            console.log('got data');
                            $scope.property = {};
                            $scope.modelName = data.data.modelName.toLowerCase();
                            $scope.property[$scope.modelName] = [];
                            
                            $scope.attributeList = data.data;
                            // angular.forEach($scope.attributeList.synonyms, function(synonym, key){
                            //     synonym.synonyms.push(synonym.field)
                            // })
                            $scope.attributeList
                            angular.extend($scope.attributeList, {
                                automap: true
                            });
                            angular.forEach(data.data.attributes, function(value, key) {
                                if (!value.values) {
                                    $scope.property[$scope.modelName].push(value);
                                } else {
                                    $scope.property[value.field] = value.values;
                                }
                                
                            })
                            $scope.orgProperty = angular.copy($scope.property);
                            getRequiredField(angular.copy($scope.orgProperty));
                            getTableData($scope.modelName);
                            $scope.tableLists = {};
                            angular.forEach($scope.orgProperty, function(value, key) {
                                $scope.tableLists[key] = [];
                            })
                        }
                    /*})
                    .catch(function() {
                        growl.error("Unable to get attributes");
                    });*/
            }

            function getRequiredField (data){
                $scope.requiredField ={}
                for(var key in data){
                    $scope.requiredField[key] = [];
                    angular.forEach(data[key], function(prop,propkey){
                        if(prop.isRequired){
                            $scope.requiredField[key].push(prop.field);
                        }
                    })
                }
            }

            var getTableData = function(table) {

                $scope.propertyList = angular.copy($scope.property[table]);
                    if(table == $scope.modelName)
                        mappedPropColumns(table,undefined,0);
                    else
                        mappedPropColumns(table.substring(0,table.length-1),undefined,table[table.length-1]);
            }

            $scope.selectTable = function(tname, rowNo, list) {
                //var otname = tname.slice(0,tname.length);
                if(tname == $scope.modelName){
                    getTableData(tname);
                    $scope.rowId = rowNo;
                }
                    
                else{
                    getTableData(tname+(rowNo+1));
                    $scope.rowId = rowNo + 1;
                }
                $scope.selectedTable = tname;
                
                $scope.selectedTableList = list;
                $scope.passingList = list;
                $scope.pickedTable = tname;
            }

            $scope.selectProperty = function(info) {
                $scope.selectedProperty = info;
            }

            $scope.selectnewPropTable = function(info, list) {
                $scope.pickedTable = info;
                $scope.passingList = list;
            }

            $scope.addToList = function() {
                if ($scope.passingList) {
                    if($scope.passingList.length > 0 && $scope.passingList[0].table !=  $scope.pickedTable){
                        growl.error('Please select column properly');
                        return;
                    }
                    // $scope.passingList.length++;
                    // for (var i = 0; i < $scope.passingList.length; i++) {
                    //     $scope.passingList[i] = {};
                    //     $scope.passingList[i].table = $scope.pickedTable;
                    //     $scope.passingList[i].rowId = i + 1;
                    //     $scope.passingList[i].reqField = [];
                    //     $scope.passingList[i].reqFieldVal = [];
                    //     for(var key in $scope.requiredField){
                    //         if(key == $scope.passingList[i].table)
                    //             $scope.passingList[i].reqField = $scope.requiredField[key]
                    //     }
                        
                    // }
                    var length = $scope.passingList.length;
                    $scope.passingList[length] = {}
                    $scope.passingList[length].table = $scope.pickedTable;
                        $scope.passingList[length].rowId = length + 1;
                        $scope.passingList[length].reqField = [];
                        $scope.passingList[length].reqFieldVal = [];
                        for(var key in $scope.requiredField){
                            if(key == $scope.passingList[length].table)
                                $scope.passingList[length].reqField = $scope.requiredField[key];
                        }

                    $scope.automapRowId = $scope.passingList.length;
                    var newTable = $scope.pickedTable + (length+1);
                    var obj = {};
                    obj[newTable] = angular.copy($scope.orgProperty[$scope.pickedTable]);
                    obj[newTable].xtra=true;
                    obj[newTable].basetable = $scope.pickedTable;
                    angular.extend($scope.property,obj)
                } else {
                    growl.error("Please select table name to add");
                }
            }

            // removing select tables and its properties

            $scope.removeProperty = function(size) {
                if ($scope.selectedTable) {
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
                        if (valid) {
                            $scope.acceptDeletetion();
                        }
                    }, function() {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                } else {
                    growl.error("Select table to delete");
                }
            };

            $scope.acceptDeletetion = function() {
                var id, prevKey, flag;
                var del = false;
                if ($scope.selectedTable != $scope.modelName) {
                    if ($scope.selectedTable && $scope.rowId) {
                        id = $scope.rowId;
                        $scope.selectedTableList.splice(id - 1, 1);
                        updateList($scope.selectedTable, id);
                        
                        angular.forEach($scope.property, function(value,key){
                            if(del && $scope.selectedTable == $scope.property[key].basetable && $scope.property[key].xtra){
                                $scope.property[prevKey] = value;
                                prevKey = key;
                                delete $scope.property[key];
                            }
                            if(!del && $scope.selectedTable + $scope.rowId == key){
                                prevKey = key
                                delete $scope.property[key];
                                del=true;
                            }

                        })
                    }
                } else {
                    growl.error("You can't delete "+ $scope.modelName+ " table ");
                }
            }

            var updateList = function(table, id) {
                var count = 0;
                for (var i = $scope.tableData.length - 1; i >= 0; i--) {
                    if ($scope.tableData[i].tableName == table &&
                        $scope.tableData[i].rowId == id) {
                        var colName = $scope.tableData[i].columnName;
                        var prop = $scope.tableData[i].propName.field;
                        $scope.tableData.splice(i, 1);
                        mappedColumns(colName, true);
                        mappedPropColumns(table, prop);
                    }
                };
                for (var i = 0; i < $scope.tableData.length; i++) {
                    if ($scope.tableData[i].tableName == table &&
                        $scope.tableData[i].rowId > id) {
                        $scope.tableData[i].rowId = $scope.tableData[i].rowId - 1;
                    }
                };

                $("option:selected").removeAttr("selected");
            }



            $scope.mapping = function() {
                if (($scope.selectedColumn || $scope.selectedColumn == "" || $scope.selectedDefaultVal) && $scope.selectedTable && $scope.selectedProperty) {
                    for(var i=0; i< $scope.tableData.length; i++){
                      if(($scope.tableData[i].tableName == $scope.selectedTable) && ($scope.selectedProperty.field == $scope.tableData[i].propName.field) && ($scope.rowId == $scope.tableData[i].rowId)){
                        growl.error('Mapping is declined, because you have already select column to property '+ $scope.selectedProperty.field);
                        return;
                      }
                    } 
                    var i = $scope.tableData.length++;
                    $scope.tableData[i] = {
                        "columnName": null,
                        "propName": null,
                        "isSelect": false,
                        "tableName": null,
                        "defaultVal": null,
                        "aIndex": 0,
                        "quotes": false,
                        "rowId": 0,
                        "transformations": []
                    };
                    $scope.tableData[i].columnName = $scope.selectedColumn;
                    $scope.tableData[i].propName = $scope.selectedProperty;
                    $scope.tableData[i].tableName = $scope.selectedTable;
                    $scope.tableData[i].rowId = $scope.rowId;
                    $scope.tableData[i].isSelect = true;
                    if ($scope.selectedDefaultVal != null) {
                        $scope.tableData[i].columnName = $scope.selectedDefaultVal.name;
                        $scope.tableData[i].defaultVal = $scope.selectedDefaultVal.value;
                        $scope.selectedDefaultVal = null;
                        defaultBtn();
                        $scope.tableData[i].quotes = true;
                    }
                    for (var j = 0; j < $scope.tableData.length; j++) {
                        if ($scope.tableData[j].tableName == $scope.selectedTable) {
                            $scope.tableData[i].aIndex++;
                        }
                    }

                    //tableLists[key]

                    /*storing required  field value to passingList variable for the purpose of showing required field value in sub Table */
                    setRequiredVal($scope.tableData[i]);
                    /*end*/

                    mappedColumns($scope.selectedColumn);
                    mappedPropColumns($scope.selectedTable,undefined,$scope.rowId);
                    $scope.defaultVal.value = '';
                    $scope.selectedColumn = undefined;
                    $scope.selectedTable = undefined;
                    $scope.selectedProperty = undefined;
                    $scope.selectedDefaultVal = undefined;
                } else {
                    growl.error('Select column, table and property names to map');
                }

                // if($scope.selectedTable == $scope.modelName){
                //     getTableData($scope.modelName);
                // }
                // else{
                //     $("option:selected").not("#SelectId option:selected").removeAttr("selected");

                //     getTableData($scope.selectedTable + $scope.rowId);
                // }
                
                $("option:selected").not("#SelectId option:selected").removeAttr("selected");
            }

            /*storing required  field value to passingList variable for the purpose of showing required field value in sub Table */
            function setRequiredVal(tableData) {
                for(var key in $scope.tableLists){
                        if(tableData.tableName == key){
                            angular.forEach($scope.tableLists[key], function(subTab,subTableKey){
                                if(tableData.rowId == subTab.rowId && subTab.reqField.indexOf(tableData.propName.field)>=0){
                                    if(tableData.defaultVal){
                                        subTab.reqFieldVal.push(tableData.defaultVal)
                                    }
                                    else{
                                        subTab.reqFieldVal.push(tableData.columnName)
                                    }
                                }
                            })
                        }
                    }
            }   
            /*end*/

            /*Remove required field vaue when mapped value removed*/

            function removeRequiredVal (tableData) {
                for(var key in $scope.tableLists){
                    if(tableData.tableName == key){
                        angular.forEach($scope.tableLists[key], function(subTab,subTableKey){
                                if(tableData.rowId == subTab.rowId){
                                    if(tableData.defaultVal){
                                        subTab.reqFieldVal.splice(subTab.reqFieldVal.indexOf(tableData.defaultVal),1);
                                    }
                                    else{
                                        subTab.reqFieldVal.splice(subTab.reqFieldVal.indexOf(tableData.columnName),1);
                                    }
                                }
                            })
                    }
                }
            }

            $scope.mapAttribute = function() {
                if ($scope.selectedColumn) {
                    if (($scope.selectedColumn == "gross_price") || ($scope.selectedColumn == "retail_price") || ($scope.selectedColumn == "grossprice") || ($scope.selectedColumn == "retailprice")) {
                        $scope.pickedTable = "prices";
                        $scope.passingList = $scope.tableLists.prices;
                    } else {
                        $scope.pickedTable = "attributeValues";
                        $scope.passingList = $scope.tableLists.attributeValues;
                    }
                    $scope.addToList();
                    if ($scope.selectedColumn) {
                        if ($scope.tableData == undefined) {
                            $scope.tableData = [];
                        }
                        var dummy = {
                            "columnName": null,
                            "propName": null,
                            "tableName": null,
                            "aIndex": 0,
                            "quotes": false,
                            "rowId": 0,
                            "ma": true,

                        };
                        var i = $scope.tableData.length++;
                        var j = $scope.tableData.length++;
                        for (var k = $scope.tableData.length; k > 0; k--) {
                            if (i == k - 2) {
                                $scope.tableData[i] = angular.copy(dummy);
                                //$scope.tableData[i].columnName = $scope.selectedColumn ;
                                $scope.tableData[i].columnName = "defaultValue";
                                $scope.tableData[i].defaultVal = $scope.selectedColumn;

                                $scope.tableData[i].tableName = $scope.pickedTable;
                                $scope.tableData[i].quotes = true;
                                //$scope.tableData[i].rowId = $scope.automapRowId;
                                
                                // if($scope.selectedDefaultVal != null){
                                //   $scope.tableData[i].columnName = $scope.selectedDefaultVal.name;
                                //   $scope.tableData[i].defaultVal = $scope.selectedDefaultVal.value;
                                //   $scope.selectedDefaultVal = null;
                                //   defaultBtn();
                                // }
                                //$scope.tableData[i].quotes = true;
                                if ($scope.tableData[i].tableName == $scope.pickedTable) {
                                    $scope.tableData[i].aIndex++;
                                }
                                if ($scope.pickedTable == "prices") {
                                    $scope.tableData[i].rowId = $scope.tableLists.prices.length;
                                    for (var q = 0; q < $scope.property.prices.length; q++) {
                                        if ($scope.property.prices[q].field == 'priceUnit') {
                                            $scope.tableData[i].propName = {};
                                            $scope.tableData[i].propName = $scope.property.prices[q];
                                        }
                                    }
                                } else {
                                    $scope.tableData[i].rowId = $scope.tableLists.attributeValues.length;
                                    for (var q = 0; q < $scope.property.attributeValues.length; q++) {
                                        if ($scope.property.attributeValues[q].field == 'attribute') {
                                            $scope.tableData[i].propName = {};
                                            $scope.tableData[i].propName = $scope.property.attributeValues[q];
                                        }
                                    }
                                }
                                setRequiredVal($scope.tableData[i]);
                                
                            }
                            if (j == k - 1) {
                                $scope.tableData[j] = angular.copy(dummy);
                                $scope.tableData[j].columnName = $scope.selectedColumn;
                                $scope.tableData[j].tableName = $scope.pickedTable;
                                if ($scope.pickedTable == "prices") {
                                    $scope.tableData[j].rowId = $scope.tableLists.prices.length;
                                    for (var q = 0; q < $scope.property.prices.length; q++) {
                                        if ($scope.property.prices[q].field == 'priceTypeId') {
                                            $scope.tableData[j].propName = {};
                                            $scope.tableData[j].propName = $scope.property.prices[q];
                                        }
                                    }
                                } else {
                                    $scope.tableData[j].rowId = $scope.tableLists.attributeValues.length;
                                    for (var q = 0; q < $scope.property.attributeValues.length; q++) {
                                        if ($scope.property.attributeValues[q].field == 'value') {
                                            $scope.tableData[j].propName = {};
                                            $scope.tableData[j].propName = $scope.property.attributeValues[q];
                                        }
                                    }
                                }
                                if ($scope.tableData[j].tableName == $scope.pickedTable) {
                                    $scope.tableData[j].aIndex = $scope.tableData[j].aIndex + 2;
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
                } else {
                    growl.error('Select column name');
                }
            }

            //automatic mapping
            $scope.automaticMap = function() {
                $scope.onLoadMap();
                $scope.mapDone = true;
                //curentlist mapped properties
                $scope.autoMap();

            }
            /*tenantid mapper function*/
            function mapTenantId () {
                //$scope.selectedColumn = $scope.columnShowList[0].colName;
                $scope.selectedColumn = "";
                $scope.selectTable ($scope.modelName, 0)
                //$scope.selectedProperty = 'tenantId';
                angular.forEach($scope.property[$scope.modelName], function(value,key){
                    if(value.field == "tenantId") {
                        $scope.selectedProperty = value;
                    }
                })
                $scope.mapping();
            }

            function mapSynonyms () {
                //$scope.columnShowList


                for(var key in $scope.property) {
                    angular.forEach($scope.property[key], function(property,propKey){
                        angular.forEach($scope.synonyms, function(synonyms,synkey){
                            if(property.field === synonyms.originalWord){
                                angular.forEach(synonyms.synonyms, function(synValue){
                                    angular.forEach($scope.columnShowList, function(column){
                                        if(synValue == column.colName){
                                            $scope.selectedColumn = synValue;
                                            var orgProp = getPropertyObjByPropField(synonyms.originalWord, key);
                                            $scope.selectedProperty = orgProp.prop;
                                            if(!$scope.property[orgProp.cat + 1] && orgProp.cat != $scope.modelName){
                                                // $scope.pickedTable = orgProp.cat;
                                                // $scope.passingList = [];
                                                $scope.selectnewPropTable(orgProp.cat, $scope.tableLists[orgProp.cat])
                                               $scope.addToList();
                                            }
                                            $scope.selectTable(orgProp.cat, 0, $scope.tableLists[orgProp.cat])
                                            $scope.mapping();
                                        }
                                    })
                                })
                            }
                                
                        })
                        
                    });
                }

                getTableData($scope.modelName);

                // angular.forEach($scope.attributeList.synonyms, function(synonym,propKey){
                //     angular.forEach(synonym.synonyms, function(synColumn){
                //         angular.forEach($scope.columnShowList, function(column){
                //             if(synColumn == column.colName){
                //                 $scope.selectedColumn = synColumn;
                //                 var orgProp = getPropertyObjByPropField(synonym.field);
                //                 $scope.selectedProperty = orgProp.prop;
                //                 $scope.selectTable(orgProp.cat, 0, $scope.tableLists[orgProp.cat])
                //                 $scope.mapping();
                //             }
                //         })
                            
                //     });
                        
                // });       
            }

            function getPropertyObjByPropField (property,whichCategory) {
                var retObj;
                for(var key in $scope.property){
                    if(key == whichCategory){
                        angular.forEach($scope.orgProperty[key], function(propObj){
                            if(propObj.field == property){
                                retObj = {
                                    prop : propObj,
                                    cat : key
                                }
                            } 
                        })
                    }
                }

                return retObj;
            }



            $scope.removeRow = function(propName, colName, tname, index) {
                removeRequiredVal($scope.tableData[index]);
                $scope.tableData.splice(index, 1);
                mappedColumns(colName, true);
                mappedPropColumns(tname, propName);

            }

            var mappedColumns = function(col, remove) {
                //mapped input columns
                if (remove == true) {
                    for (var j = 0; j < $scope.columnShowList.length; j++) {
                        if ($scope.columnShowList[j].colName == col) {
                            $scope.columnShowList[j].isSelect = false;
                        }
                    }
                }
                for (var j = 0; j < $scope.columnShowList.length; j++) {
                    for (var i = 0; i < $scope.tableData.length; i++) {
                        if ($scope.columnShowList[j].colName == $scope.tableData[i].columnName) {
                            $scope.columnShowList[j].isSelect = true;
                        }
                    }
                }
            }

            var mappedPropColumns = function(tname, propName, rowId) {
                //mapped propertyList columns
                if (propName) {
                    for (var i = 0; i < $scope.propertyList.length; i++) {
                        if ($scope.propertyList[i].field == propName) {
                            $scope.propertyList[i].isSelect = false;
                        }
                    }
                }
                for (var i = 0; i < $scope.propertyList.length; i++) {
                    if ($scope.tableData) {
                        for (var j = 0; j < $scope.tableData.length; j++) {
                            if ($scope.propertyList[i].field == $scope.tableData[j].propName.field &&
                                $scope.tableData[j].tableName == tname && $scope.tableData[j].rowId == rowId) {
                                $scope.propertyList[i].isSelect = true;
                            }
                        }
                    }
                }
            }

            $scope.changeFormat = function() {
                alert("chnaged");
                console.log('===',$scope.unformatedData);
                //$scope.fileStyle.delimeterFormat = guessDelimiters(angular.copy($scope.unformatedData),[',',';','|'])
                $scope.uploadedDataDump = angular.copy($scope.unformatedData);
                $scope.uploadedDataDump.headers = splitter($scope.uploadedDataDump.headers, $scope.fileStyle.delimeterFormat);
                $scope.uploadedDataDump.rowOne = splitter($scope.uploadedDataDump.rowOne, $scope.fileStyle.delimeterFormat);
                $scope.uploadedDataDump.rowTwo = splitter($scope.uploadedDataDump.rowTwo, $scope.fileStyle.delimeterFormat);
                $scope.uploadedData = angular.copy($scope.uploadedDataDump);

                $scope.dupUploadedData = angular.copy($scope.uploadedData);

                $scope.dupUploadedData.rowOne = changeDateFormat($scope.dupUploadedData.rowOne, $scope.fileStyle.dateFormat);
                $scope.dupUploadedData.rowTwo = changeDateFormat($scope.dupUploadedData.rowTwo, $scope.fileStyle.dateFormat);
                $scope.dupUploadedData.rowOne = changeNumberFormat($scope.dupUploadedData.rowOne, $scope.fileStyle.numberFormat);
                $scope.dupUploadedData.rowTwo = changeNumberFormat($scope.dupUploadedData.rowTwo, $scope.fileStyle.numberFormat);
                
                 if(!$scope.setting.isBackToSecondStep)
                    loadingColumns($scope.dupUploadedData.headers);
            }

            var changeDateFormat = function(list, format) {
                console.log('list', list);
                console.log('$scope.fileStyle.dateFormat',$scope.fileStyle.dateFormat);
                console.log('format', format);
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        if (isNaN(list[i])) {
                            var d = new Date(list[i]);
                            if (d != "Invalid Date") {
                               if($scope.fileStyle.dateFormat == guessDateFormat(angular.copy($scope.unformatedData), ["dd-MM-yyyy", "MM/dd/yyyy"], $scope.fileStyle.delimeterFormat)[0]){
                                    //list[i] = $filter('date')(new Date(list[i]), 'mediumDate')
                                    list[i] = $filter('date')(new Date(list[i]), 'MM/dd/yyyy');
                                    console.log('-----list[i]-----', list[i]);
                               }
                               else{
                                    var date = d.getDate();
                                if (date < 10) date = "0" + date;
                                var month = d.getMonth() + 1;
                                if (month < 10) month = "0" + month;
                                var year = d.getFullYear();
                                if (format == "MM/dd/yyyy")
                                    list[i] = month + "/" + date + "/" + year;
                                else
                                    list[i] = date + "-" + month + "-" + year;
                               }
                            }
                        }
                    };
                    return list;
                }
            }

            var changeNumberFormat = function(list, format) {
                for (var i = 0; i < list.length; i++) {
                    if (!isNaN(list[i])) {
                        if (format == '#,##') {
                            if(list[i].indexOf(',')<0)
                                list[i] = list[i] + ',00';
                        }
                        if (format == '#.##') {
                            if(list[i].indexOf('.')<0)
                                list[i] = list[i] + '.00';
                        }

                        if (format == '#,###.##') {
                            if (list[i].toString().length > 5) {
                                list[i] = (list[i]*100 / 100);
                                var str = list[i].toString().split('.');
                                if (str[0].length >= 4) {
                                    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                                }
                                if (str[1] && str[1].length >= 4) {
                                    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
                                }
                                list[i] = str.join('.');
                                if(list[i].indexOf('.') < 0){
                                    list[i] = list[i] + '.00'
                                }
                            }

                        }
                        if (format == '#.###,##') {
                            var str = list[i].toString();
                            if (str.length > 5) {
                                str = list[i].slice(0, -5) + '.' + list[i].slice(-3) + '.' + list[i].slice(-3); 
                                list[i] = str;
                                if(list[i].indexOf(',') < 0){
                                    list[i] = list[i] + ',00'
                                }
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

            $scope.resetData = function() {
                $scope.dupUploadedData = angular.copy($scope.uploadedData);
                defaultFilePreviewSettings();
                
                $scope.fileStyle.delimeterFormat = guessDelimiters(angular.copy($scope.unformatedData), [',', ';', '|'])[0];
                $scope.fileStyle.dateFormat = guessDateFormat(angular.copy($scope.unformatedData), ["dd-MM-yyyy", "MM/dd/yyyy"], $scope.fileStyle.delimeterFormat)[0];
                //$scope.fileStyle.numberFormat = "#,###.##";
                //$scope.changeFormat();
                $scope.fileStyle.numberFormat = guessNumberFormat(angular.copy($scope.unformatedData), ["#,###.##","#.###,##","#.##","#,##"], $scope.fileStyle.delimeterFormat)[0];
                if(!$scope.fileStyle.numberFormat){
                    $scope.fileStyle.numberFormat = "#,###.##";
                 }       
            }

            $scope.startRead = function(files) {
                var data = {};
                data.file = files[0];
                data.file_name = files[0].name;
                var fd = new FormData();
                angular.forEach(data, function(value, key) {
                    console.log("keyyy", key);
                    console.log("value", value);
                    fd.append(key, value);
                });
                console.log('==fd===',fd);
                $http.post('/uploadedFileData', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .success(function(data, status) {
                        $scope.unformatedData = angular.copy(data);
                        $scope.fileStyle.delimeterFormat = guessDelimiters(angular.copy($scope.unformatedData), [',', ';', '|'])[0];
                        $scope.fileStyle.dateFormat = guessDateFormat(angular.copy($scope.unformatedData), ["dd-MM-yyyy", "MM/dd/yyyy"], $scope.fileStyle.delimeterFormat)[0];
                        $scope.fileStyle.numberFormat = guessNumberFormat(angular.copy($scope.unformatedData), ["#,###.##","#.###,##","#.##","#,##"], $scope.fileStyle.delimeterFormat)[0];
                        if(!$scope.fileStyle.numberFormat){
                            $scope.fileStyle.numberFormat = "#,###.##";
                        }
                        $scope.secondStep();
                    })
                    .error(function(data) {
                        growl.error("Unable to upload file");
                    });
            }

            var loadingColumns = function(list) {
                    var selectedColumns = [];
                    for (var i = 0; i < list.length; i++) {
                        selectedColumns[i] = {
                            "colName": null,
                            "isSelect": null
                        };
                        // selectedColumns[i].colName = $filter('smallize')(list[i]);
                        selectedColumns[i].colName = list[i];
                        selectedColumns[i].isSelect = false;
                    };
                    $scope.columnShowList = selectedColumns;
                    $scope.orgColumnShowList = angular.copy($scope.columnShowList);
                    if(!$scope.fileStyle.includeHeader){
                        $scope.changeColumn($scope.fileStyle.includeHeader)
                    }
                    //$scope.secondStep(); 

                }

            $scope.changeColumn = function(isHeader){
                console.log('chnageColumn');
                if(isHeader == false){
                    console.log($scope.columnShowList);
                    angular.forEach($scope.columnShowList, function(col,colkey){
                        $scope.columnShowList[colkey].colName = 'Column ' + colkey;
                        $scope.columnShowList[colkey].isSelect = false;
                    })

                }
                else{
                  $scope.columnShowList = angular.copy($scope.orgColumnShowList)
                  console.log($scope.columnShowList);
                }
                if(!$scope.edit){
                    $scope.tableLists = {};
                    angular.forEach($scope.orgProperty, function(value, key) {
                        $scope.tableLists[key] = [];
                    })
                }
                
                
            }
                //check required fields mapping is done or not
            
            var checkMapping = function(tableInfo) {
                // var reqFieldList = [];
                // var k = 0;
                console.log("$scope.property", $scope.property);

                var valid = true;
                for(var key in $scope.property){
                    console.log('==========================',key);
                    console.log('--------------------------',$scope.attributeList);
                    if($scope.attributeList.subdocument.indexOf(key)<0){

                        for(var i=0; i< $scope.property[key].length; i++){
                        if($scope.property[key][i].isRequired == true){
                            //isAvailableInTableInfo($scope.property[key][i], key, tableInfo)
                            var count =0;
                             for(var j=0; j< tableInfo.length; j++){
                                if((key == $scope.modelName) && (tableInfo[j].tableName == key) && (tableInfo[j].propName.field == $scope.property[key][i].field)){
                                    count++;
                                }
                                else if((key != $scope.modelName) &&(key == tableInfo[j].tableName + tableInfo[j].rowId) && (tableInfo[j].propName.field == $scope.property[key][i].field)){
                                     count++;
                                }
                               
                             }
                             if(count == 0){
                                return false;
                             }
                        
                        }
                    }
                }
                    
            }
            return true;
        

                // for (var i = 0; i < $scope.propertyList.length; i++) {
                //     if ($scope.propertyList[i].isRequired) {
                //         reqFieldList[k] = $scope.propertyList[i].field;
                //         k++;
                //     }
                // };
                // var clength = 0;
                // for (var i = 0; i < tableInfo.length; i++) {
                //     for (var j = 0; j < reqFieldList.length; j++) {
                //         if (tableInfo[i].propName.field == reqFieldList[j]) {
                //             clength++;
                //         }
                //     }
                // };
                // if (clength >= reqFieldList.length)
                //     return true;
                // else {
                //     return false;
                // }
            }

            // function isAvailableInTableInfo (){
            //     for(var j=0; j< tableInfo.length; j++){
            //                 // angular.forEach(tableInfo, function(tableprop, keytabprop){
            //                 //     if((key == $scope.modelName) && (tableprop.tableName == key) && (tableprop.propName.field == property.field)){

            //                 //     }
            //                 //     else if((key != $scope.modelName) && (tableprop.tableName == key) && (tableprop.propName.field == property.field)){
            //                 //         valid 
            //                 //     }
            //                 //     else{
            //                 //         valid = false;
            //                 //     }
            //                 // })
            //     }
            // }

            //getMappedJson
            var getMappingJson = function(tenantId, mappingId) {
                $scope.mappedJson=false;
                $http.get('/getMappingDataForPreview/' + tenantId + '/' + mappingId)
                    .success(function(data) {
                        $scope.mappedJson = data.slice(0,5);
                        //$scope.downloadedData = data;
                        
                    })
                    .error(function() {
                        growl.error("Unable to get mapping list");
                    });
            }

            $scope.importJson = function(){
                $http.get('/getMappingData/1' + '/' + $scope.mapInf._id)
                    .success(function(data) {
                        $scope.downloadedData = data;
                        var blob = new Blob([JSON.stringify($scope.downloadedData)], {type: "text/json;charset=utf-8"});
                        saveAs(blob, $scope.mapInf.mappingName + ".json");  
                    })
                    .error(function() {
                        growl.error("Unable to get mapping list");
                    });

                
            }



            //Steps involved
            $scope.firstStep = function() {
                $scope.badge.step = "one";
                //reset data
                if ($scope.newMap == true) {
                    $location.path("#/");
                }
            }

            $scope.secondStep = function() {
                $scope.badge.step = "two";
                if(!$scope.setting.isBackToSecondStep){
                    getPropertyList();
                    $scope.changeFormat();
                }
                
                //loadingColumns($scope.uploadedData.headers);
            }

            // $scope.isBackTosecondStep = function() {
            //     $scope.badge.step = "two";
            //     // if(!$scope.setting.isBackToSecondStep){
            //     //     getPropertyList();
            //     //     $scope.changeFormat();
            //     // }
                
            //     //loadingColumns($scope.uploadedData.headers);
            // }

            function splitter(data, splittype) {
                console.log('data',data);
                console.log('splittype', splittype)
                return data.split(splittype);
            }

            $scope.reloadStep = function() {
                $location.path("#/");
            }

            $scope.thirdStep = function(info, form){
                var modalInstance = $modal.open({
                      animation: true,
                      templateUrl: 'isPopupContent.html',
                      controller: 'isAutoMapCtrl',
                      size: 'sm',
                      resolve: {
                        
                      }
                    });

                    modalInstance.result.then(function (isautomap) {
                      $scope.isAutomap = isautomap;
                      $scope.loadThirdStep(info, form);
                    }, function () {
                      $log.info('Modal dismissed at: ' + new Date());
                      $scope.isAutomap = false;
                      $scope.loadThirdStep(info, form);
                    });
                  

                  
                
            }
            $scope.loadThirdStep = function(info, form) {
                
                $scope.submit = true;
                if(form.$valid){
                     $scope.badge.step = "three";
                
                // if ($scope.tableData == undefined) {
                    $scope.tableData = [];
                // }
                if ($scope.map == undefined) {
                    $scope.map = {
                        name: null
                    }
                }
                $scope.fileViewFormats = info;
                // if(!$scope.setting.isBackToSecondStep && $scope.isMapSaved != true){
                    mapTenantId();
                    if($scope.isAutomap){
                        
                        if($scope.fileStyle.includeHeader)
                            mapSynonyms();
                    }
                    
                // }
                $scope.setting.isBackToSecondStep = false;
                $scope.submit = false;
                }
               
            }
            $scope.isBackToThirdStep =function(){
                $scope.badge.step = "three";
            }
            $scope.edit = false;
            $scope.editMapping = function(map) {
                if(typeof map == 'undefined'){
                     growl.error("Please select Mapping Name");
                     return;
                }
                $scope.edit = true;
                $scope.badge.step = "three";
                $scope.isMapSaved = false;

                $q.all([MapperService.getMappingCSV(map.tenantId, map._id).then(function(data) {
                        $scope.unformatedData = angular.copy(data.data);

                    })
                    .catch(function(err) {
                        growl.error("Unable to get mapping list");
                    }),

                    MapperService.getMappingData(map.tenantId, map._id).then(function(data) {
                        $scope.tableData = {};
                        $scope.uploadedData = {};
                        $scope.map = {};
                        $scope.tableData = data.data[0].mappingInfo;
                        $scope.mapid = data.data[0]._id;
                        $scope.mapdata = data.data[0];

                        /*this is hardcode but in feature it will dynamic*/
                        var duptableData = [];
                        //$scope.tableLists=[];
                        angular.forEach($scope.tableData, function(val, key) {
                            var mapper = {
                                propName: {}
                            };
                            val.propName = {};
                            if (val.values.length == 0) {
                                mapper.tableName = $scope.modelName;
                                mapper.propName.field = val.field;
                                mapper.propName.index = val.index;
                                mapper.propName.instance = val.instance;
                                mapper.propName.isRequired = val.isRequired;
                                mapper.columnName = val.userFieldName;
                                mapper.defaultVal = val.defaultValue;
                                mapper.transformations = val.transformations;
                                mapper.rowId = 0;
                                if (val.defaultValue)
                                    mapper.quotes = true;
                                //$scope.saveIndex(duptableData.length,'edit');     
                                duptableData.push(mapper);
                            } else {

                                angular.forEach(val.values, function(vals1, keys1) {
                                    angular.forEach(vals1.fields, function(val1, key1) {
                                    var mapper = {
                                        propName: {}
                                    };
                                    mapper.tableName = val.field;
                                    mapper.propName.field = val1.field;
                                    mapper.propName.index = val1.index;
                                    mapper.propName.instance = val1.instance;
                                    mapper.propName.isRequired = val1.isRequired;
                                    mapper.transformations = val1.transformations;
                                    mapper.defaultVal = val1.defaultValue;
                                    mapper.columnName = val1.userFieldName;
                                    mapper.rowId = val1.rowId;
                                    //$scope.tableLists[val.field] = $scope.tableLists[val.field] ? $scope.tableLists[val.field] : [];
                                    //$scope.tableLists[val.field].push({rowId: val1.rowId,table:val.field });
                                    if(!$scope.property.hasOwnProperty(val.field + val1.rowId)){
                                        $scope.selectnewPropTable(val.field, $scope.tableLists[val.field]);
                                        $scope.addToList();
                                    }
                                    
                                    if (val1.defaultValue)
                                        mapper.quotes = true;
                                    //$scope.saveIndex(duptableData.length,'edit');
                                    duptableData.push(mapper);
                                    setRequiredVal(mapper)
                                });

                                })
                            }
                        })
                        $scope.tableData = duptableData;
                        angular.forEach($scope.tableData, function(val, key) {
                            $scope.saveIndex(key, 'edit');
                        })
                        $scope.uploadedData.fileName = data.data[0].fileName;
                        $scope.map.name = data.data[0].mappingName;
                        $scope.fileViewFormats = data.data[0].delimeter;

                    })
                    .catch(function(err) {
                        growl.error("Unable to get mapping list");
                    })

                ]).then(function(values) {

                    $scope.uploadedDataDump = angular.copy($scope.unformatedData);
                    $scope.uploadedDataDump.headers = splitter($scope.uploadedDataDump.headers, $scope.mapdata.delimeter.delimeterFormat);
                    $scope.uploadedDataDump.rowOne = splitter($scope.uploadedDataDump.rowOne, $scope.mapdata.delimeter.delimeterFormat);
                    $scope.uploadedDataDump.rowTwo = splitter($scope.uploadedDataDump.rowTwo, $scope.mapdata.delimeter.delimeterFormat);
                    $scope.uploadedData = angular.copy($scope.uploadedDataDump);
                    $scope.dupUploadedData = angular.copy($scope.uploadedData);
                    loadingColumns($scope.dupUploadedData.headers);
                    $scope.changeColumn($scope.mapdata.delimeter.includeHeader);
                    $scope.selectTable($scope.modelName);
                    mappedColumns();

                })

            }

            


            $scope.saveMappingStep = function(map, tableInfo) {
                console.log("=====", map);
                console.log("-----", tableInfo);
                if (map.name) {
                    if (tableInfo.length > 0) {
                        $scope.submitted = false;
                        var valid = true;
                        if (valid == true) {
                            var mappingDetails = {};
                            // mappingDetails._id = tableInfo._id :
                            mappingDetails.tenantId = 1;
                            mappingDetails.fileName = $scope.uploadedData.fileName;
                            mappingDetails.mappingName = map.name;
                            mappingDetails.delimeter = $scope.fileViewFormats;
                            mappingDetails.mappingInfo = [];
                            var len = 0;
                            for (var i = 0; i < tableInfo.length; i++) {
                                // if(!tableInfo[i].isEdit){
                                var isExisting = false;
                                if (tableInfo[i].tableName == $scope.modelName) {
                                    mappingDetails.mappingInfo[len++] = {
                                        "userFieldName": tableInfo[i].columnName,
                                        "transformations": tableInfo[i].transformations,
                                        "field": tableInfo[i].propName.field,
                                        "defaultValue": tableInfo[i].defaultVal,
                                        "index": tableInfo[i].propName.index,
                                        "instance": tableInfo[i].propName.instance,
                                        "isRequired": tableInfo[i].propName.isRequired,
                                        "rowId": tableInfo[i].rowId
                                    };
                                } else {
                                    angular.forEach(mappingDetails.mappingInfo, function(val, key) {
                                        if(tableInfo[i].tableName != $scope.modelName && val.field == tableInfo[i].tableName){
                                            var isdup = true;
                                            angular.forEach(val.values,function(inVal, inKey){
                                                
                                                    if(inVal.fields[0].rowId == tableInfo[i].rowId){
                                                        inVal.fields.push({
                                                            "userFieldName": tableInfo[i].columnName,
                                                            "transformations": tableInfo[i].transformations,
                                                            "field": tableInfo[i].propName.field,
                                                            "defaultValue": tableInfo[i].defaultVal,
                                                            "index": tableInfo[i].propName.index,
                                                            "instance": tableInfo[i].propName.instance,
                                                            "isRequired": tableInfo[i].propName.isRequired,
                                                            "rowId": tableInfo[i].rowId
                                                        })
                                                        isExisting = true;
                                                        isdup = false;
                                                    }
                                                
                                            })
                                            if(isdup == true){
                                                val.values.push({
                                                            "fields":[{
                                                            "userFieldName": tableInfo[i].columnName,
                                                            "transformations": tableInfo[i].transformations,
                                                            "field": tableInfo[i].propName.field,
                                                            "defaultValue": tableInfo[i].defaultVal,
                                                            "index": tableInfo[i].propName.index,
                                                            "instance": tableInfo[i].propName.instance,
                                                            "isRequired": tableInfo[i].propName.isRequired,
                                                            "rowId": tableInfo[i].rowId
                                                            }]
                                                        })
                                                isExisting = true;
                                            }
                                        }
                                        
                                    })
                                    if (isExisting == false) {
                                        mappingDetails.mappingInfo[len++] = {
                                            "field": tableInfo[i].tableName,
                                            "values":[{ 
                                                "fields":[{
                                                "userFieldName": tableInfo[i].columnName,
                                                "transformations": tableInfo[i].transformations,
                                                "field": tableInfo[i].propName.field,
                                                "defaultValue": tableInfo[i].defaultVal,
                                                "index": tableInfo[i].propName.index,
                                                "instance": tableInfo[i].propName.instance,
                                                "isRequired": tableInfo[i].propName.isRequired,
                                                "rowId": tableInfo[i].rowId,
                                                
                                                }]
                                            }]
                                        };
                                    }

                                }

                            };
                            if ($scope.mapid) {
                                saveEditedMapping(mappingDetails);
                            } else {
                                saveMapping(mappingDetails);
                            }

                            //reset newmap
                            $scope.newMap = false;
                            //get list
                            $scope.tableData = {};
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

            var saveEditedMapping = function(data) {

                $http.put('/updateMapping/' + $scope.mapid, data).then(function(data) {
                        $scope.mapid = null;
                        $scope.isMapSaved = true;
                        growl.success("Mapping has been saved successfully");
                        getMappingList(1);
                    })
                    .catch(function(err) {
                        console.log('error', err);
                    })
            }

            //save maping
            var saveMapping = function(map) {
                $http.post('/createMapping', map)
                    .success(function(data) {
                        $scope.isMapSaved = true;
                        growl.success("Mapping has been saved successfully");
                        getMappingList(1);
                    })
                    .error(function(err) {

                        if (err.statusCode == 403) {
                            growl.error("Mapping name already exist.");
                        } else
                            growl.error("Unable to save Mapping");
                    });
            }

            //getMappingList
            var getMappingList = function(tenantId) {
                
                 if (!$scope.edit) {
                    MapperService.getMappingList(tenantId).then(function(data) {
                            $scope.mappingList = data.data;
                            for(var i=0; i<$scope.mappingList.length;i++){
                                if ($scope.mappingList[i].mappingName == $scope.map.name) {
                                    $scope.selectedMapping = $scope.mappingList[i];

                                    //$scope.edit = false;
                                }
                            }
                            // angular.forEach($scope.mappingList, function(value, key) {
                            //     if (value.mappingName == $scope.map.name) {
                            //         //$scope.selectedMapping = value;
                            //         angular.extend($scope.selectedMapping, value);
                            //         $scope.edit = false;
                            //     }
                            // })
                        }) 
                        .catch(function(err) {
                            growl.error("Unable to get mapping list");
                        });
                 } else {
                     $scope.edit = false;
                 }
                $scope.tabledata = {};
                getPropertyList();
            }

            $scope.newMapping = function() {
                $scope.newMap = true;
            }

            $scope.fourthStep = function(selectedMapping) {
                $scope.badge.step = "four";
                getMappingJson(1, selectedMapping._id);
                $scope.mapInf = selectedMapping;
            }

            _scope.init();

            /*Edit Mapping Code saperately*/

            $scope.editMap = function() {
                $scope.badge.step = 'three';
                var tenantId = 1;
                MapperService.getMappingList(tenantId).then(function(data) {
                        $scope.mappingList = data.data;
                        $scope.isMapSaved = true;
                        getPropertyList();
                    })
                    .catch(function(err) {
                        growl.error("Unable to get mapping list");
                    });

            }

            function guessNumberFormat(text, possibleNumberFormat, delimiter) {
                return possibleNumberFormat.filter(testNumberFormat);

                function testNumberFormat(numberFormat) {
                    var textArray = [];
                    textArray.push(text.rowOne);
                    textArray.push(text.rowTwo);
                    return textArray.every(splitLine);

                    function splitLine(line) {
                        var wordArray = line.split(delimiter);
                        //return true;
                        return wordArray.every(matchNumberFormat);

                        function matchNumberFormat(word) {
                            if (!isNaN(word)) {
                                
                                if(numberFormat == '#,###.##'){
                                    var patt = new RegExp("^(([0-9]{1,3}(,[0-9]{3}){0,100}).[0-9]{2})$");
                                    var patt1 = new RegExp("^(([#]{1,3}(,[#]{3}){0,100}).[#]{2})$");
                                    var res1 = patt.test(word) && patt1.test(numberFormat);
                                    if(word.length<5)
                                        return false;
                                    return res1;
                                }

                                if(numberFormat == '#.###,##'){
                                    var patt = new RegExp("^(([0-9]{1,3}(.[0-9]{3}){0,100}),[0-9]{2})$");
                                    var patt1 = new RegExp("^(([#]{1,3}(.[#]{3}){0,100}),[#]{2})$");
                                    var res1 = patt.test(word) && patt1.test(numberFormat);
                                    if(word.length<5)
                                        return false;
                                    return res1;
                                }

                                if(numberFormat == '#.##'){
                                    var patt = new RegExp("^([0-9]{0,300}.[0-9]{2})$");
                                    var patt1 = new RegExp("^([#]{1}.[#]{2})$");
                                    var res1 = patt.test(word) && patt1.test(numberFormat);
                                    return res1;
                                }

                                if(numberFormat == '#,##'){
                                    var patt = new RegExp("^([0-9]{0,300},[0-9]{2})$");
                                    var patt1 = new RegExp("^([#]{1},[#]{2})$");
                                    var res1 = patt.test(word) && patt1.test(numberFormat);
                                    return res1;
                                }
                                

                                // var patt2 = new RegExp("^(([0-9]{1,3}(.[0-9]{3}){0,100}),[0-9]{2})$");
                                // var res1 = patt.test(word) && patt1.test(dateFormat);

                                // if (d != "Invalid Date") {
                                //     var patt = new RegExp("[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}");
                                //     var patt1 = new RegExp("[d|M]{1,2}\/[d|M]{1,2}\/[y]{4}");
                                //     var res1 = patt.test(word) && patt1.test(dateFormat);

                                //     var patt = new RegExp("[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}");
                                //     var patt1 = new RegExp("[d|M]{1,2}\-[d|M]{1,2}\-[y]{4}");
                                //     var res2 = patt.test(word) && patt1.test(dateFormat);
                                //     return res1 || res2;
                                // }
                            }
                            return true;
                        }
                    }
                }
            }

            function guessDelimiters(text, possibleDelimiters) {
                return possibleDelimiters.filter(weedOut);

                function weedOut(delimiter) {
                    var cache = -1;
                    var textArray = [];
                    textArray.push(text.headers);
                    textArray.push(text.rowOne);
                    textArray.push(text.rowOne);

                    return textArray.every(checkLength);

                    function checkLength(line) {
                        if (!line) {
                            return true;
                        }

                        var length = line.split(delimiter).length;
                        if (cache < 0) {
                            cache = length;
                        }
                        return cache === length && length > 1;
                    }
                }
            }

            function guessDateFormat(text, possibleDateFormat, delimiter) {
                console.log(text, 'possibleDelimiters', possibleDateFormat, 'delimiter', delimiter);
                console.log('possiblities',possibleDateFormat.filter(testFormat));
                return possibleDateFormat.filter(testFormat);

                function testFormat(dateFormat) {
                    console.log('testFormat', dateFormat);
                    var textArray = [];
                    //textArray.push(text.headers);
                    textArray.push(text.rowOne);
                    textArray.push(text.rowTwo);
                    return textArray.every(splitLine);

                    function splitLine(line) {
                        var wordArray = line.split(delimiter);
                        //return true;
                        return wordArray.some(testDateFormat);

                        function testDateFormat(word) {
                            if (isNaN(word)) {
                                var d = new Date(word);
                                if (d != "Invalid Date") {
                                    var patt = new RegExp("[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}");
                                    var patt1 = new RegExp("[d|M]{1,2}\/[d|M]{1,2}\/[y]{4}");
                                    var res1 = patt.test(word) && patt1.test(dateFormat);

                                    var patt = new RegExp("[0-9]{1,2}\-[0-9]{1,2}\-[0-9]{4}");
                                    var patt1 = new RegExp("[d|M]{1,2}\-[d|M]{1,2}\-[y]{4}");
                                    var res2 = patt.test(word) && patt1.test(dateFormat);
                                    return res1 || res2;
                                }
                            }
                        }
                    }
                }
            }


        }
    ]);

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
                fn(scope, {
                    $event: event
                });
            });
        });
    };
});

//filters
app.filter('smallize', function() {
    return function(input, scope) {
        if (input != null)
            return input.substring(0, 1).toLowerCase() + input.substring(1);
    }
});

app.controller('confirmationModalInstanceCtrl', function($scope,
    $modalInstance, table_scope, row_no) {
    $scope.selectedTable = table_scope;
    $scope.num = row_no;
    $scope.acceptDelete = function() {
        var cnfDelete = true;
        $modalInstance.close(cnfDelete);
    }
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});


app.controller('isAutoMapCtrl', function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close(true);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
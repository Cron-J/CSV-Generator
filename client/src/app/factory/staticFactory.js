'use strict'; 

app.factory('staticFactory', function(){
	var tableArray = [];
	//Product table
	tableArray['Product', 'catalogId'] = "Catalog";
	// tableArray['Product', 'tenantId'] = "tenantId";
	// tableArray['Product', 'supplierId'] = "supplierId";
	tableArray['Product', 'ean'] = "EAN";
	tableArray['Product', 'extProductId'] = "ExtProductId";
	tableArray['Product', 'isConfigurable'] = "Is Configurable";
	tableArray['Product', 'isPunchout'] = "Is Punchout";
	tableArray['Product', 'isForSales'] = "IsForSales";
	tableArray['Product', 'isMainProdLine'] = "IsMainProdLine";
	tableArray['Product', 'isSpecialOffer'] = "IsSpecialOffer";
	tableArray['Product', 'isStocked'] = "IsStocked";
	tableArray['Product', 'keywords'] = "Keywords";
	tableArray['Product', 'manufactererId'] = "Manufacturer";
	tableArray['Product', 'manufactererName'] = "ManufacturerName";
	tableArray['Product', 'mfgProductId'] = "MfgProductId";
	tableArray['Product', 'productId'] = "ProductId";
	tableArray['Product', 'productIdExtension'] = "ProductIdExtension";
	tableArray['Product', 'salesUnitOfMeasureId'] = "SalesUnitOfMeasure";
	tableArray['Product', 'statusId'] = "Status";
	tableArray['Product', 'unitOfMeasureId'] = "UnitOfMeasure";
	tableArray['Product', 'validFrom'] = "ValidFrom";
	tableArray['Product', 'validTo'] = "ValidTo";
	
	//Prices table
	// tableArray['Prices', 'productId'] = "productId";
	tableArray['Prices', 'contractId'] = "Contract";
	tableArray['Prices', 'currencyId'] = "Currency";
	tableArray['Prices', 'description'] = "Description";
	tableArray['Prices', 'fixNetPrice'] = "FixNetPrice";
	tableArray['Prices', 'grossPrice'] = "GrossPrice";
	tableArray['Prices', 'isPreferred'] = "IsPreferred";
	tableArray['Prices', 'netPrice'] = "NetPrice";
	tableArray['Prices', 'priceUnit'] = "PriceUnit";
	tableArray['Prices', 'statusId'] = "Status";
	tableArray['Prices', 'validFrom'] = "ValidFrom";
	tableArray['Prices', 'validFromQuantity'] = "ValidFromQuantity";
	tableArray['Prices', 'validTo'] = "ValidTo";
	tableArray['Prices', 'vatPercentage'] = "VatPercentage";
	tableArray['Prices', 'listPrice'] = "listPrice";
	tableArray['Prices', 'priceTypeId'] = "priceType";
	tableArray['Prices', 'productIdExtensionForUoM'] = "productIdExtensionForUom";
	tableArray['Prices', 'unitOfMeasureId'] = "UnitOfMeasure";
	
	//ProductAttributeValues table
	tableArray['ProductAttributeValues', 'attribute'] = "Attribute";
	// tableArray['ProductAttributeValues', 'productId'] = "productId";
	tableArray['ProductAttributeValues', 'languageId'] = "Language";
	tableArray['ProductAttributeValues', 'value'] = "Value";
	// tableArray['importOverwriteLock'] = "importOverwriteLock";
	tableArray['ProductAttributeValues', 'orderNro'] = "orderNo";
	tableArray['ProductAttributeValues', 'statusId'] = "status";
	
	//ClassificationAssignment table
	tableArray['ClassificationAssignment', 'classificationId'] = "Classification";
	tableArray['ClassificationAssignment', 'classificationGroupId'] = "classificationGroup";
	tableArray['ClassificationAssignment', 'orderNro'] = "orderNro";
	// tableArray['ClassificationAssignment', 'productId'] = "productId";
	
	//ProductRelations table
	// tableArray['ProductRelations', 'productId'] = "productId";
	tableArray['ProductRelations', 'quantity'] = "Quantity";
	tableArray['ProductRelations', 'relatedProductId'] = "RelatedProduct";
	tableArray['ProductRelations', 'relatedCatalogId'] = "RelatedProductCatalog";
	tableArray['ProductRelations', 'seqNo'] = "SeqNo";
	tableArray['ProductRelations', 'statusId'] = "Status";
	tableArray['ProductRelations', 'syncTypeId'] = "SyncTypeId";
	tableArray['ProductRelations', 'typeId'] = "Type";
	tableArray['ProductRelations', 'udxNum1'] = "UdxNum1";
	tableArray['ProductRelations', 'udxNum2'] = "UdxNum2";
	tableArray['ProductRelations', 'udxNum3'] = "UdxNum3";
	tableArray['ProductRelations', 'udxSortKey1'] = "UdxSortKey1";
	tableArray['ProductRelations', 'udxSortKey2'] = "UdxSortKey2";
	tableArray['ProductRelations', 'udxSortKey3'] = "UdxSortKey3";
	tableArray['ProductRelations', 'udxText1'] = "UdxText1";
	tableArray['ProductRelations', 'udxText2'] = "UdxText2";
	tableArray['ProductRelations', 'udxText3'] = "UdxText3";
	tableArray['ProductRelations', 'validFrom'] = "ValidFrom";
	tableArray['ProductRelations', 'validTo'] = "ValidTo";
	tableArray['ProductRelations', 'description'] = "description";
	tableArray['ProductRelations', 'isDefaultSelected'] = "isDefaultSelected";
	tableArray['ProductRelations', 'isMandatory'] = "isMandatory";
	// tableArray['isReverse'] = "isReverse";
	tableArray['ProductRelations', 'selectionGroupId'] = "selectionGroupId";
	tableArray['ProductRelations', 'relatedTenantId'] = "relatedTenantId";
	//ContractedProduct table
	tableArray['ContractedProduct', 'contractId'] = "Contract";
	tableArray['ContractedProduct', 'leadtimeInDays'] = "LeadTimeInDays";
	tableArray['ContractedProduct', 'maxQuantity'] = "MaxQuantity";
	tableArray['ContractedProduct', 'minQuantity'] = "MinQuantity";
	tableArray['ContractedProduct', 'priceQuantity'] = "PriceQuantity";
	tableArray['ContractedProduct', 'quantityInterval'] = "QuantityInterval";
	tableArray['ContractedProduct', 'salesUnitOfMeasureId'] = "SalesUnitOfMeasure";
	tableArray['ContractedProduct', 'visibility'] = "Visibility";
	tableArray['ContractedProduct', 'extProductId'] = "altExtProductId";
	tableArray['ContractedProduct', 'descLong'] = "descLong";
	tableArray['ContractedProduct', 'descShort'] = "descShort";
	tableArray['ContractedProduct', 'extClassificationGroupId'] = "extClassificationGroupId";
	tableArray['ContractedProduct', 'extClassificationId'] = "extClassificationId";
	tableArray['ContractedProduct', 'extGLAccountId'] = "extGlAccountId";
	tableArray['ContractedProduct', 'extProductId'] = "extProductId";
	tableArray['ContractedProduct', 'statusId'] = "status";
	tableArray['ContractedProduct', 'statusDate'] = "statusDate";
	// tableArray['ContractedProduct', 'productId'] = "productId";

	var factory = {}; 

  factory.tableArrayFn = function() {
    return tableArray;
  }

  return factory;       
});


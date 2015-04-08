var Config = require('../config/config');

exports.removeCollections = function(mongoose, callback){
    mongoose.connection.db.collectionNames(function(err, collections){
        if(collections.map(function(e) { return e.name; }).indexOf(Config.database.db+'.mappings') != -1) {
                mongoose.connection.db.dropCollection('mappings', function(err) {
                callback(err);
            });
        }
        else{
            callback();
        }
    });
};

exports.successData = function(){
    var mappingWithRequired = {
        "tenantId": 1,
        "fileName": "demo.csv1428470969006",
        "mappingName": "soni",
        "mappingInfo": [
            {
                "userFieldName": "productId",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    },
                    {
                        "def": {
                            "name": "uppercase",
                            "params": [],
                            "defaultParams": []
                        },
                        "params": [],
                        "text": "uppercase()",
                        "added": false
                    }
                ],
                "field": "isConfigurable",
                "index": null
            },
            {
                "userFieldName": "gross_price",
                "transformations": [
                    {
                        "def": {
                            "name": "first",
                            "params": [
                                {
                                    "name": "firstFilter",
                                    "type": "int"
                                }
                            ],
                            "defaultParams": [
                                5
                            ]
                        },
                        "params": [
                            "5"
                        ],
                        "text": "first(5)",
                        "added": false
                    }
                ],
                "field": "isMainProdLine",
                "index": null
            },
            {
                "userFieldName": "size",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    }
                ],
                "field": "isPunchout",
                "index": null
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "productId",
                "index": true,
                "instance": "String",
                "isRequired": true
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "tenantId",
                "index": true,
                "instance": "String",
                "isRequired": true
            }
        ]
    }
    return mappingWithRequired;
}

exports.dataWithoutTenant = function(){
    var mappingWithRequired = {
        "fileName": "demo.csv1428470969006",
        "mappingName": "soni",
        "mappingInfo": [
            {
                "userFieldName": "productId",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    },
                    {
                        "def": {
                            "name": "uppercase",
                            "params": [],
                            "defaultParams": []
                        },
                        "params": [],
                        "text": "uppercase()",
                        "added": false
                    }
                ],
                "field": "isConfigurable",
                "index": null
            },
            {
                "userFieldName": "gross_price",
                "transformations": [
                    {
                        "def": {
                            "name": "first",
                            "params": [
                                {
                                    "name": "firstFilter",
                                    "type": "int"
                                }
                            ],
                            "defaultParams": [
                                5
                            ]
                        },
                        "params": [
                            "5"
                        ],
                        "text": "first(5)",
                        "added": false
                    }
                ],
                "field": "isMainProdLine",
                "index": null
            },
            {
                "userFieldName": "size",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    }
                ],
                "field": "isPunchout",
                "index": null
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "productId",
                "index": true,
                "instance": "String",
                "isRequired": true
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "tenantId",
                "index": true,
                "instance": "String",
                "isRequired": true
            }
        ]
    }
    return mappingWithRequired;
}

exports.dataWithoutMapping = function(){
    var mappingWithRequired = {
        "tenantId": 1,
        "fileName": "demo.csv1428470969006",
        "mappingInfo": [
            {
                "userFieldName": "productId",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    },
                    {
                        "def": {
                            "name": "uppercase",
                            "params": [],
                            "defaultParams": []
                        },
                        "params": [],
                        "text": "uppercase()",
                        "added": false
                    }
                ],
                "field": "isConfigurable",
                "index": null
            },
            {
                "userFieldName": "gross_price",
                "transformations": [
                    {
                        "def": {
                            "name": "first",
                            "params": [
                                {
                                    "name": "firstFilter",
                                    "type": "int"
                                }
                            ],
                            "defaultParams": [
                                5
                            ]
                        },
                        "params": [
                            "5"
                        ],
                        "text": "first(5)",
                        "added": false
                    }
                ],
                "field": "isMainProdLine",
                "index": null
            },
            {
                "userFieldName": "size",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    }
                ],
                "field": "isPunchout",
                "index": null
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "productId",
                "index": true,
                "instance": "String",
                "isRequired": true
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "tenantId",
                "index": true,
                "instance": "String",
                "isRequired": true
            }
        ]
    }
    return mappingWithRequired;
}

exports.dataWithoutFileName = function(){
    var mappingWithRequired = {
        "tenantId": 1,
        "mappingName": "soni",
        "mappingInfo": [
            {
                "userFieldName": "productId",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    },
                    {
                        "def": {
                            "name": "uppercase",
                            "params": [],
                            "defaultParams": []
                        },
                        "params": [],
                        "text": "uppercase()",
                        "added": false
                    }
                ],
                "field": "isConfigurable",
                "index": null
            },
            {
                "userFieldName": "gross_price",
                "transformations": [
                    {
                        "def": {
                            "name": "first",
                            "params": [
                                {
                                    "name": "firstFilter",
                                    "type": "int"
                                }
                            ],
                            "defaultParams": [
                                5
                            ]
                        },
                        "params": [
                            "5"
                        ],
                        "text": "first(5)",
                        "added": false
                    }
                ],
                "field": "isMainProdLine",
                "index": null
            },
            {
                "userFieldName": "size",
                "transformations": [
                    {
                        "def": {
                            "name": "append",
                            "params": [
                                {
                                    "name": "appendedString"
                                }
                            ],
                            "defaultParams": [
                                "#A"
                            ]
                        },
                        "params": [
                            "#A"
                        ],
                        "text": "append(#A)",
                        "added": false
                    }
                ],
                "field": "isPunchout",
                "index": null
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "productId",
                "index": true,
                "instance": "String",
                "isRequired": true
            },
            {
                "userFieldName": "productId",
                "transformations": [],
                "field": "tenantId",
                "index": true,
                "instance": "String",
                "isRequired": true
            }
        ]
    }
    return mappingWithRequired;
}
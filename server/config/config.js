module.exports = {
    server: {   
            host: '0.0.0.0',
            port: 8080
    },
    host: {
        ModuleLinkup:'modulus-linkup-45480.onmodulus.net',
        getSchema:'/getProductSchema',
        isProductSchema: true
    },
    database: {
        db: 'mongodb://127.0.0.1/csvGenerator'
        //db: 'mongodb://gaurav:cronj123@proximus.modulusmongo.net:27017/oxUhed6y'
     }
};

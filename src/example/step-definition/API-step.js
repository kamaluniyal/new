/*this file contain the actual mapping code w.r.to feature file. It will have actual code which will inturn iteract with 
library and page files to perform desired operation on the application. For sample ex see below*/

"use strict";
var webdriver = require('selenium-webdriver');
var config = require('config');
var Yadda = require('yadda');
var funLib = require('../../../lib/function-library.js');
var APILib = require('../../../lib/APIlib.js');
var url = config.get('intranet.url');
var Example = require('../page/example-page.js');
var examplePage, functionLibrary,APILibrary;

const tableData = "VALE@9.99@-0.4@33.8M@INFY@14.56@-1.6@25.7M@VIPS@9.27@-6@30.7M@BABA@169.25@-1@22.4M@JMEI@3.28@-6.8@19.4M@JD@41.26@2.8@17.2M";

module.exports = (function () {
    var dictionary = new Yadda.Dictionary()
        .define('LOCALE', /(fr|es|ie)/)
        .define('NUM', /(\d+)/);
    var library = new Yadda.localisation.English.library(dictionary)

    /*
    * Start of Scenarios for Actions Verification in Function Library
    */
    
    .given("User Executes APITests", function () {
       APILibrary = new APILib(this.driver);
         functionLibrary = new funLib(this.driver);
       console.log("Inside given User executes API tests");
       APILibrary.fnexecuteAPITests("Sheet3");
      
           
        })
    
    .then("User verify parameter value", function () {
           //APILibrary.fncreateActualUrl();
            functionLibrary.fnGoBack();
        });

    return library;
})();
var webdriver = require('selenium-webdriver');
var fs = require('fs');
var assert = require('assert');
var config = require('config');
var excelLib = require('./excel-util.js');
var funLib = require('./function-library.js');
const APIxlpath = config.get('APIxlPath');
var supertest = require("supertest");
var expect = require('chai').expect;

var endPoint,APIServer,APIpath,APIurl,authentication,operationType,Inputs,resParams,validation,usedRowNum;
var responseParams=[];
var validationParams=[];
functionLibrary = new funLib(this.driver);

//var pdfDocument;
APIlib = function APIlib(driver) {
    this.driver = driver;
};


APIlib.prototype.fncreateAPIUrl = function (SheetName,rowNum) {     
    var promDefer = webdriver.promise.defer();
    excelUtil = new excelLib();
    excelUtil.fnExcelGetInstance(); 
 
//this.fngetAPIServer(SheetName,rowNum).then(function(serverlocation){
//console.log("server location is "+serverlocation);
//});

// excelUtil.fnExcelGetCellData(APIxlpath,SheetName,rowNum,3).then(function(cellValue3){
//        APIpath = cellValue3;
//        console.log(APIpath);
//     })
// excelUtil.fnExcelGetCellData(APIxlpath,SheetName,rowNum,4).then(function(cellValue4){
//        authentication = cellValue4;
//        console.log(authentication);
//     })

// excelUtil.fnExcelGetCellData(APIxlpath,SheetName,4,6).then(function(cellValue6){
//        Inputs = cellValue6;
//        console.log(Inputs);
//     })

//var RowCount , ColCount ;
//excelUtil.fnGetxlUsedRowNum(APIxlpath,SheetName).then(function(val){
  //console.log("Row count--->"+val);
//});

// ColCount = excelUtil.fnGetxlUsedColNum(APIxlpath,SheetName) ;
// console.log("Row count--->"+RowCount);
// console.log("COl count--->"+ColCount);

////RowCount = excelUtil.fnGetxlUsedRowNum(APIxlpath,SheetName);
//console.log("Row count--->"+RowCount);
    
 return promDefer.promise;
};


APIlib.prototype.fnexecuteAPITests = function(SheetName){
var promDefer = webdriver.promise.defer();
excelUtil = new excelLib();
excelUtil.fnExcelGetInstance(); 
console.log("excel path"+APIxlpath);
console.log("Sheetname"+SheetName);

//excelUtil.fnGetxlUsedRowNum(APIxlpath,SheetName).then(function(usedRowNum){
//var usedRowNum = excelUtil.fnGetxlUsedRowNum(APIxlpath,SheetName);
//var usedRowNum=2
console.log("usedRowNum-------",usedRowNum);
var usedRowNum=2
    for (var i=2 ;i<=usedRowNum;i++){
        APIServer           = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,2);
        APIPath             = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,3);
        Authnetication      = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,4);
        OperationType       = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,5);
        Inputs              = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,6);
        responseParams      = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,7);
        validationParams    = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,8);
               
        Promise.all([
            APIServer,
            APIPath, 
            Authnetication,
            OperationType,
            Inputs,
            responseParams,
            validationParams            
            ]).then(values => { 
            
            switch(values[3]){
                case "GET":
                apiserver = supertest(values[0]);
                this.fnverifyResponse(values[0].text,values[1],values[2],values[4],values[5],values[6]);
                break;
                case "PUT":
                // Call PUT
                break;         
            }
            promDefer.fulfill(true);
        });       
    }
   return promDefer.promise;
//});
};



APIlib.prototype.fnverifyResponse = function (apiserver,APIPath,Authnetication,Inputs,responseParams,validationParams) {
var promDefer = webdriver.promise.defer();   

    if(!apiserver|!APIPath|!Authnetication|!Inputs|!responseParams|!validationParams){
        assert.fail(true,false,"Invalid inputs !");
        }

    APIurl=APIPath+"?"+Inputs ;
    var input,expected,actualInput,resinput;        
    validationParams = validationParams.replace("\r","");  
    validationParams = validationParams.split("\n");
    responseParams = responseParams.replace("\r","");
    responseParams = responseParams.split("\n");
    
    console.log(validationParams);
    api = supertest(apiserver);
    api.get(APIurl)
     .end((err,res) =>{
         expect(res).to.have.status(200);
         validationParams.forEach((validation) =>{  
            validation.replace("\r","");
            input=validation.split("=")[0];
            expected=validation.split("=")[1];            
            var val =  this.fnGetJsonDataFromKeyPath(res.body,input)
            expect(val).to.equal(expected);
            functionLibrary.fnLogInfo('Validating-'+input+ '-to be equal to-'+expected);
                        
     })
        // for response params
         responseParams.forEach((response) =>{  
            console.log("response---",response);
            response.replace("\r","");                       
            var val =  this.fnGetJsonDataFromKeyPath(res.body,response)
            console.log("val---",val);
            expect(val).to.exist;
            functionLibrary.fnLogInfo('Validating-'+response+ '-to be present in response body');                       
     })
    })  

   };

// APIlib.prototype.fngetAPIServer = function (SheetName,rowNum) {
//   var promDefer = webdriver.promise.defer();
//   excelUtil.fnExcelGetCellData(APIxlpath,SheetName,rowNum,2).then(function(cellValue2){
//        APIServer = cellValue2.text;
//        //console.log(APIServer);
//        //return APIServer ;
//        //return promDefer.promise;
//     })

// };

// APIlib.prototype.fngetResponseparams = function (SheetName,rowNum) {
//   var promDefer = webdriver.promise.defer();
//   excelUtil.fnExcelGetCellData(APIxlpath,SheetName,rowNum,7).then(function(cellValue7){
//        resParams = cellValue7;
       
//        responseParams = resParams.split("\n");
//        //console.log(params);
//     }) 
// return promDefer.promise;
// };


// APIlib.prototype.fngetvalidationparams = function (SheetName,rowNum) {
//  var promDefer = webdriver.promise.defer();
//  excelUtil.fnExcelGetCellData(APIxlpath,SheetName,rowNum,8).then(function(cellValue8){
//        validation = cellValue8;
//        validationParams = validation.split("\n");
//        console.log(validationParams);
//        })
// return promDefer.promise;
// };


// APIlib.prototype.fngetUsedRownum = function (SheetName) {
//  var promDefer = webdriver.promise.defer();
//  excelUtil.fnGetxlUsedRowNum(APIxlpath,SheetName).then(function(Value){
//        UsedRownum = cellValue5;
//        console.log("UsedRownum is ---",UsedRownum);
//     })
// return promDefer.promise;
// };


APIlib.prototype.fnGetJsonDataFromKeyPath = function (data,path) {
    var pathArr = path.replace("[",".").replace("]","").split(".");
        var val = data;
        pathArr.forEach(function(path) {
            val =val [path];
         });
         return val ;

}

module.exports = APIlib; 

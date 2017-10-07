var webdriver = require('selenium-webdriver');
var fs = require('fs');
var assert = require('assert');
var config = require('config');
var excelLib = require('./excel-util.js');
var funLib = require('./function-library.js');
const APIxlpath = config.get('APIxlPath');
var supertest = require("supertest");
var expect = require('chai').expect;
functionLibrary = new funLib(this.driver);

var endPoint,APIServer,APIpath,APIurl,authentication,operationType,Inputs,resParams,expctdStatus,validation,usedRowNum;
var responseParams=[];
var validationParams=[];

APIlib = function APIlib(driver) {
    this.driver = driver;
};

/*
 * # Function Name: fnexecuteAPITests
 * 
 * # Author:NIX Team
 * 
 * # Description:This function will execute api test cases as per sheetName given . APIExcel path to be given in config file
 * 
 * # Input Parameters: String :sheetName : Name of the sheet
 * 					   
 */


APIlib.prototype.fnexecuteAPITests = function(SheetName){
var promDefer = webdriver.promise.defer();
excelUtil = new excelLib();
excelUtil.fnExcelGetInstance(); 
excelUtil.fnGetUsedRowNum(APIxlpath,SheetName).then((usedRowNum)=>{

    for (var i=2 ;i<=usedRowNum;i++){
        APIServer           = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,2);
        APIPath             = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,3);
        Authnetication      = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,4);
        OperationType       = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,5);
        Inputs              = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,6);
        expctdStatus        = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,7);
        responseParams      = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,8);
        validationParams    = excelUtil.fnExcelGetCellData(APIxlpath,SheetName,i,9);
               
        Promise.all([
            APIServer,
            APIPath, 
            Authnetication,
            OperationType,
            Inputs,
            expctdStatus,
            responseParams,
            validationParams            
            ]).then(values => { 
            
            switch(values[3]){
                case "GET":
                //apiserver = supertest(values[0]);
                this.fnverifyResponse(values[0].text,values[1],values[2],values[4],values[5],values[6],values[7]);
                break;
                
                case "POST":
                //apiserver = supertest(values[0]);
                this.fnpost(values[0].text,values[1],values[2],values[4],values[5],values[6],values[7]);
                break;         
            }
            promDefer.fulfill(true);
        });       
    }
   return promDefer.promise;
});
};


/*
 * # Function Name: fnexecuteAPITests
 * 
 * # Author:NIX Team
 * 
 * # Description:This function will verify response . It is used internally by APILib , not be called from outside
 * 
 * # Input Parameters:As passed from calling function
 * 					   
 */
APIlib.prototype.fnverifyResponse = function (apiserver,APIPath,Authnetication,Inputs,expctdStatus,responseParams,validationParams) {
var promDefer = webdriver.promise.defer();   

//     if(!apiserver|!APIPath|!Authnetication|!Inputs|!responseParams|!validationParams){
//         assert.fail(true,false,"Invalid inputs !");
//    } 

    APIurl=APIPath+"?"+Inputs ;
    var input,expected,actualInput,resinput;        
    validationParams = validationParams.replace("\r","");  
    validationParams = validationParams.split("\n");
    responseParams = responseParams.replace("\r","");
    responseParams = responseParams.split("\n");   
 
    api = supertest(apiserver);
    api.get(APIurl)
     .end((err,res) =>{
         expect(res.status).to.equal(expctdStatus);
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
            //console.log("response---",response);
            response.replace("\r","");                       
            var val =  this.fnGetJsonDataFromKeyPath(res.body,response)
            //console.log("val---",val);
            expect(response).to.exist;
            functionLibrary.fnLogInfo('Validating-'+response+ '-to be present in response body');                       
     })
    })  

   };



/*
 * # Function Name: fnpost
 * 
 * # Author:NIX Team
 * 
 * # Description:This function will post data to api server as per input . It is used internally by APILib , not be called from outside
 * 
 * # Input Parameters:As passed from calling function
 * 					   
 */
APIlib.prototype.fnpost = function (apiserver,APIPath,Authnetication,Inputs,expctdStatus,responseParams,validationParams) {
var promDefer = webdriver.promise.defer();   

console.log("inside fnpost")
//     if(!apiserver|!APIPath|!Authnetication|!Inputs|!responseParams|!validationParams){
//         assert.fail(true,false,"Invalid inputs !");
//    } 

    APIurl="/api/1.0/watchlist/holdings" ;
    var input,expected,actualInput,resinput;   
    var parambody = {xids: ['205778']};
   //var parambody ={ "postcodes": ["SW1A 0AA", "SW1A 0PW", "SW1A 1AA"]};
    //validationParams = validationParams.replace("\r","");  
    //validationParams = validationParams.split("\n");
    //responseParams = responseParams.replace("\r","");
    //responseParams = responseParams.split("\n");   
//apiserver="http://api.postcodes.io";
apiserver="http://financialpost.markitqa.com";
 console.log("api server",apiserver);
    api = supertest(apiserver);
  console.log("api url",APIurl);
    api.post(APIurl)
   console.log(api);
       //api.send(parambody)
       //api.set("Content-Type", "application/json")
//api.type("form");
 api.put(parambody)
//api.set('Accept', 'application/json')

     .end((err,res) =>{
          expect({success:true});
          console.log(res.body)
         expect(res.status).to.equal(200);
         //validationParams.forEach((validation) =>{  
           // validation.replace("\r","");
            ///input=validation.split("=")[0];
            //expected=validation.split("=")[1];            
            //var val =  this.fnGetJsonDataFromKeyPath(res.body,input)
            //expect(val).to.equal(expected);
            //functionLibrary.fnLogInfo('Validating-'+input+ '-to be equal to-'+expected);
                        
     })
        // for response params
         //responseParams.forEach((response) =>{  
           // console.log("response---",response);
           // response.replace("\r","");                       
            //var val =  this.fnGetJsonDataFromKeyPath(res.body,response)
            //console.log("val---",val);
            //expect(val).to.exist;
            //functionLibrary.fnLogInfo('Validating-'+response+ '-to be present in response body');                       
     //})
    //})  

   };

/*
 * # Function Name: fnGetJsonDataFromKeyPath
 * 
 * # Author:NIX Team
 * 
 * # Description:This method parse response body to find the json key , retuns value of the key
 * 
 * # Input Parameters:String data : API response body
 *                    String path : Path of key (json key as expected in response body)
 * 					   
 */

APIlib.prototype.fnGetJsonDataFromKeyPath = function (data,path) {
    var pathArr = path.replace("[",".").replace("]","").split(".");
        var val = data;
        pathArr.forEach(function(path) {
            val =val [path];
         });
         return val ;

}

module.exports = APIlib; 

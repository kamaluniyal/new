var webdriver = require('selenium-webdriver');
var Excel = require('exceljs');
var logger = require('./log4js.js'); //This is required to set the var to log configuration file where log configuration has been defined.
var log = logger.LOG; //This is how you can get hold of LOG static variable which you can use to log details.
var workBook;

ExcelUtil = function ExcelUtil() {

};

/*
 * # Function Name: fnExcelGetInstance()
 * 
 * # Author:
 * 
 * # Description: This function will create/get the instance of excel workbook.
 * 
 * # Input Parameters: String : NA 
 */

ExcelUtil.prototype.fnExcelGetInstance = function (path) {
	var promDefer = webdriver.promise.defer();
	log.info("In fnExcelGetInstance");
	workBook = new Excel.Workbook();
	promDefer.fulfill(true);
	return promDefer.promise;
};

/*
 * # Function Name: fnExcelGetCellData()
 * 
 * # Author: Raj Mohan Singh
 * 
 * # Description: This function will retirive the value of specific cell from excel sheet.
 * 
 * # Input Parameters: Webelement : String - Path/location of the excel workbook ,String - name of the excel sheet
 * 									Integer - row number ,Integer - Column number
 */

ExcelUtil.prototype.fnExcelGetCellData = function (path,sheetName,row, col) {
	var promDefer = webdriver.promise.defer();
	workBook.xlsx.readFile(path).then(function () {
	var workSheet=workBook.getWorksheet('Sheet1');
	var rowVal = workSheet.getRow(row);
	var cellData = rowVal.getCell(col).value;
	promDefer.fulfill(cellData);
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});
	
	
	return promDefer.promise;
};



/*
 * # Function Name: fnExcelEnterCellData()
 * 
 * # Author: Raj Mohan Singh
 * 
 * # Description: This function will retirive the value of specific cell from excel sheet.
 * 
 * # Input Parameters: Webelement : String - Path/location of the excel workbook ,String - name of the excel sheet
 * 									Integer - row number ,Integer - Column number
 */


ExcelUtil.prototype.fnExcelEnterCellData = function (path,sheetName,row,col, cellData) {
	var promDefer = webdriver.promise.defer();
	log.info("In fnExcelEnterCellData");
	//Get sheet by Name
	workBook.xlsx.readFile(path).then(function () {
	var workSheet=workBook.getWorksheet(sheetName);
	var rowVal = workSheet.getRow(row);
	rowVal.getCell(col).value = cellData;
	rowVal.commit();
	workBook.xlsx.writeFile(path).then(function(){
			
		log.info("Pass - save the file!!! Please check");
	
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});
	promDefer.fulfill(true);
	return promDefer.promise;
};

/*
 * # Function Name: fnExcelEnterDatainemptyrow()
 * 
 * # Author: Raj Mohan Singh
 * 
 * # Description: This function will enter data in first emply row of  spacified column in excel sheet.
 * 
 * # Input Parameters: Webelement : String - Path/location of the excel workbook ,String - name of the excel sheet
 * 									Integer - row number ,Integer - Column number, String - data to be entered
 */

ExcelUtil.prototype.fnExcelEnterDatainemptyrow = function (path,sheetName,cellData,col) {
	var promDefer = webdriver.promise.defer();
	log.info("In fnExcelEnterDatainemptyrow");
	if (col== "" || col==null){
		col =1;
	}
	workBook.xlsx.readFile(path).then(function () {

	var workSheet=workBook.getWorksheet(sheetName);
	
	var rowcount = workSheet.rowCount;
	log.info(rowcount);
	lrow = workSheet.getRow(rowcount+1);

	lrow.getCell(col).value = cellData;
	lrow.commit();
	workBook.xlsx.writeFile(path).then(function(){
			
		log.info("Pass - save the file!!! Please check");
	
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Fail - "+e.message);

	});

	}, function (e) {
		promDefer.fulfill(false);
		log.error("Fail - "+e.message);

	});
	
		
	promDefer.fulfill(true);
	return promDefer.promise;
};

/*
 * # Function Name: fnExcelGetDatabyRow()
 * 
 * # Author: Raj Mohan Singh
 * 
 * # Description: This function will retirive row data from excel sheet.
 * 
 * # Input Parameters: Webelement : String - Path/location of the excel workbook ,String - name of the excel sheet
 * 									String - data to be entered ,Integer[optional] - Column number, if empty take 1 as column number 
 */


ExcelUtil.prototype.fnExcelGetDatabyRow = function (path,sheetName,row) {
	var promDefer = webdriver.promise.defer();
	log.info("In fnExcelGetDatabyRow");
	var excelValByRow = [];
	//Get sheet by Name
	workBook.xlsx.readFile(path).then(function () {
	var workSheet=workBook.getWorksheet(sheetName);
	var excelRow = workSheet.getRow(row);			
	excelRow.eachCell(function(cell, colNumber) {
    log.info('Cell ' + colNumber + ' = ' + cell.value);
	excelValByRow.push(cell.value);
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});
	
	}, function (e) {
		promDefer.fulfill(false);
		log.error("Error - "+e.message);

	});
	
	promDefer.fulfill(excelValByRow);
	return promDefer.promise;
};

ExcelUtil.prototype.fnGetxlUsedRowNum = function (path,sheetName) {
	var promDefer = webdriver.promise.defer();
	log.info("In fnGetxlUsedRowNum");
	var excelRowCount ;
	workBook.xlsx.readFile(path).then(function () {
	var workSheet=workBook.getWorksheet("Sheet1");
	 excelRowCount = workSheet.rowCount;
		console.log("excelRowCount is -",excelRowCount);	
		promDefer.fulfill(excelRowCount);
	//return excelRowCount;
					
	})
	
	
};

ExcelUtil.prototype.fnGetxlUsedColNum = function (path,sheetName) {
	var promDefer = webdriver.promise.defer();
	log.info("In fnGetxlUsedColNum");
	var excelColCount;
	workBook.xlsx.readFile(path).then(function () {
	var workSheet=workBook.getWorksheet(sheetName);
	 excelColCount = workSheet.columnCount;
	})
	promDefer.fulfill(excelColCount);
	return promDefer.promise;
	
};




module.exports = ExcelUtil; 

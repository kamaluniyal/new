//This file contains test scenario and a set of test cases in the form of 
//Given: is a pre -requiste to perform the action or base state
//when: is required action on the application
//then: is the validation point/verification point for the above performed action  

Scenario: Verification of Text library for File module
   Given User check the file exist
   When User Append data in text file
   Then User read data from text file

//Scenario: Verification of Excel library for Excel module
  // Given User get the excel instance
   //When User Get cell data
   //Then User enter and save excel sheet

//Scenario: Verification of PDF library for PDF module
  // Given User get the PDF instance
   //When User Pass the Page Number
   //Then User Get the data and verify with text
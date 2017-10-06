//This file contains test scenario and a set of test cases in the form of 
//Given: is a pre -requiste to perform the action or base state
//when: is required action on the application
//then: is the validation point/verification point for the above performed action  

Feature: Verification of Actions functions on Test Automation Example Page

Scenario: Verification of Action Functions 

   Given User is on TAF Example Page
   When The hidden text is visible
   Then User enter text in Text box
   Then User selects options from select menu   
   //Then User select Mutual Funds and ETFs checkbox   
  // Then User uncheck ETFs checkbox
  // Then User selects Options radio button
  // Then User performs mouseover on hover text
  // Then User scrolls the page to bottom
  // Then User enters text in the text box inside iframe
   //Then User switch to top frame and selects Mutual Funds
   //Then User clicks on link to open new window and switch back to parent window
   
//Scenario: Verification of verify functions of function library

  // Given User is on the Example Page
   //Then User verifies elements on the page
   //And User verifies dropdown options
   //And User verifies state of element
   //And User verifies headers and data of webtable
   //And User verifies date format
   //And User verifies element attribute
   //And User verifies element color

//Scenario: Verification of data functions of function library
  // Given User is on the Example Page
   //When User generates random alphanumeric string
   //And User gets element text on the page
   //And User gets headers text of webtable on the page
   //And User gets data of webtable on the page
   //And User gets Row data for particular column webtable on the page
   //And User gets column data for particular row webtable on the page

//Scenario: Verification of Drag and Drop
  // Given User opens selenium demo page
   //When User performs drag-drop
   //Then User verify element is dragged to droppable section
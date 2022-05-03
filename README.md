# testing-project-no.-3

Cypress automation testing of E-commerce web application covering some of the most important areas from the business point of view. 


* Sign-Up form 
  * smoke test of happy path
  * negative testing 
    * (.type() into forms, .click() elements, .check() checkboxes, page object pattern, assertions and other actions)
    * .intercept() API requests 
---------------------------------------------------------------
* Login form 
  * smoke test of happy path
  * negative testing 
    * (.type() into forms, .click() elements, .check() checkboxes, assertions and other actions)
---------------------------------------------------------------
* Purchasing a subscription
  *  E2E testing of purchasing a subscription
     * custom commands
     * fixtures
     * assertions
     * .each() to make sure total prices are correctly counted and displayed in the shopping cart as well as checkout
---------------------------------------------------------------
* Purchasing products
  * E2E testing of purchasing products including:
    * cookies manipulation
    * assertions
    * using .each() to make sure total prices are correctly counted and displayed in the shopping cart as well as checkout
    * using .each() to make sure proper products are correctly displayed throughout all the steps
---------------------------------------------------------------
* Checkout
  * validating input fields
  * verifying error validation messages
  * (.type() into forms, .click() elements, .select() dynamic and static dropdowns)


Cypress automation testing of E-commerce web application covering some of the most important areas from the business point of view. 

1. Sign-Up form 
2. Login form 
3. Purchasing a subscription
4. Purchasing products
5. Checkout
-------------------------------------
* (.type() into forms, .click() elements, .check() checkboxes, .select() dynamic and static dropdowns)
* cookie manipulation
* .each() 
* .intercept() API requests 
* cy.request() to login without use of GUI
* page object pattern
* chai and cypress built in assertions
* custom commands
* fixtures
* and other actions

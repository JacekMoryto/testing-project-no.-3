# testing-project-no.-3

Automation testing using Cypress as part of current learning.

The scripts are partially covering testing functionalities of the most important areas and scenarios from the business point of view of E-commerce web application.

1. Sign-Up form 
2. E2E Purchasing a subscription
3. E2E Purchasing products
4. Checkout
-------------------------------------
The Spec files include: 
* cy.type() into forms, cy.click() elements, cy.check() checkboxes, cy.select() dynamic and static dropdowns
* cy.invoke() jQuery methods 
* cookie manipulation
* cy.each() to ensure total prices are correctly counted and products are correctly displayed throughout all the steps of purchase paths
* cy.intercept() network requests 
* cy.request() to login without use of GUI
* page object pattern
* chai BDD assertions and cypress built in assertions
* custom commands
* stubbing response data using cy.fixture()
* and other commands/actions

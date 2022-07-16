/// <reference types="Cypress" />

describe('My first test scenario', function () {
  it('my first test case', function () {
    cy.request({
      method: 'POST',
      url: 'https://author.lavazza.it/libs/granite/core/content/login.html/j_security_check',
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        referer:
          'https://author.lavazza.it/libs/granite/core/content/login.html?resource=%2Fsites.html%2Fcontent&$$login$$=%24%24login%24%24&j_reason=unknown&j_reason_code=unknown',
      },
      //credentials deleted 
      body: Cypress.env('LoginCredentials'),
    });
    cy.visit('https://author.lavazza.it');
  });
});

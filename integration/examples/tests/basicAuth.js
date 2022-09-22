/// <reference types="Cypress" />

describe('My first test scenario', function () {
  it('basic auth with headers property', function () {
    cy.visit('https://the-internet.herokuapp.com/basic_auth', {
      headers: {
        authorization: 'Basic YWRtaW46YWRtaW4=',
      },
    });
  });

  it('basic auth with auth property', function () {
    cy.visit('https://the-internet.herokuapp.com/basic_auth', {
      auth: {
        username: 'admin',
        password: 'admin',
      },
    });
  });

  it('requests with auth property', function () {
    cy.request({
      method: 'GET',
      url: 'https://the-internet.herokuapp.com/basic_auth',
      auth: {
        username: 'admin',
        password: 'admin',
      },
    }).then((response) => {
      cy.log(response);
    });
  });
});

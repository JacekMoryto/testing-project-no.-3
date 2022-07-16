/// <reference types="Cypress" />

describe('Cookie preservance before Sign-Up verification', function () {
  it('saves consent cookie from cookie banner', function () {
    cy.visit('https://www.lavazza.com.au/en_AU/coffee/capsules.html');
    cy.contains('ACCEPT ALL').click();
    Cypress.Cookies.preserveOnce('CONSENTMGR');
    cy.getCookie('CONSENTMGR').should('exist');
  });
});

describe('E2E buy product', function () {
  it('adds product to cart', function () {
    cy.visit('https://www.lavazza.com.au/en_AU/coffee/capsules.html');

    cy.get('.box.-price[stocklevelstatus="inStock"]').each((el, i) => {
      const productVariant = el.attr('data-var');
      //add to cart
      cy.get(el).next().click();
      cy.wait(3000);
      //grab variant code from attribute
      cy.get('.quick-cart .product').eq(i);
    });

    cy.visit('https://www.lavazza.com.au/en_AU/utils/checkout.html');
    // cy.get('.shopping-bag').click();
    // cy.get('.quick-cart .cta.cta.-submit').click();
    // cy.get('.coupon-section__cta').click();
    // cy.get('.goNoLog .cta.-half').click();
  });

  //   ----------------CHECKOUT---------------------------
  //   ----------------Title dropdown------------------

  it('verifies Title dropdown', function () {
    cy.get('#deliveryFieldset option[value]').should((el) => {
      expect(el[0]).to.have.value('ms');
      expect(el[1]).to.have.value('mr');
      expect(el[2]).to.have.value('miss');
      expect(el[3]).to.have.value('mrs');
    });
    cy.get('select[name="title"]').should('not.have.attr', 'required');
    cy.get('select[name="title"]').select('ms');
  });

  //----------------Name field------------------
  it('verifies Name field', function () {
    //req: at least 2 characters
    cy.get('input[name="name"]')
      .as('nameField')
      .should('have.attr', 'data-required', 'true')
      .type('a')
      .should('have.value', 'a');
    cy.get('@nameField').blur();
    cy.get('.message')
      .should('have.text', 'Must contain at least 2 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@nameField').clear();

    //req: Cannot contain numbers & special characters
    cy.get('input[name="name"]').type('123').should('have.value', '123');
    cy.get('@nameField').blur();

    cy.get('.message')
      .should('have.text', 'Cannot contain numbers & special characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@nameField').clear();
    cy.get('@nameField').type('Jane');
  });

  //----------------Surname field------------------
  //req: at least 2 characters
  it('verifies surName field', function () {
    cy.get('input[name="surname"]')
      .as('surnameField')
      .should('have.attr', 'data-required', 'true')
      .type('a')
      .should('have.value', 'a');
    cy.get('@surnameField').blur();
    cy.get('.message')
      .should('have.text', 'Must contain at least 2 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@surnameField').clear();

    //req: Cannot contain numbers & special characters
    cy.get('input[name="surname"]').type('123').should('have.value', '123');
    cy.get('@surnameField').blur();

    cy.get('.message')
      .should('have.text', 'Cannot contain numbers & special characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@surnameField').clear();
    cy.get('@surnameField').type('Lane');
  });

  //----------------Email field------------------
  //req: at least 5 characters
  it('verifies email field', function () {
    cy.get('input[name="email"]')
      .as('emailField')
      .should('have.attr', 'data-required', 'true')
      .type('a')
      .should('have.value', 'a');
    cy.get('@emailField').blur();
    cy.get('input[name="email"]')
      .next()
      .should('have.text', 'Must contain at least 5 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@emailField').clear();

    //req: must follow certain format
    cy.get('@emailField').type('@gmail.com').should('have.value', '@gmail.com');
    cy.get('@emailField').blur();

    cy.get('@emailField')
      .next()
      .should('have.text', 'Must follow this format: your@email.com')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@emailField').clear();
    cy.get('@emailField').type('lalala@gmail.com');
  });

  //----------------Confirm Email field------------------
  //req: at least 5 characters
  it('verifies confirm-email field', function () {
    cy.get('input[name="repeatemail"]')
      .as('repeatEmailField')
      .should('have.attr', 'data-required', 'true')
      .type('a')
      .should('have.value', 'a');
    cy.get('@repeatEmailField').blur();
    cy.get('@repeatEmailField')
      .next()
      .should('have.text', 'Must contain at least 5 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@repeatEmailField').clear();

    //req: must follow certain format
    cy.get('@repeatEmailField')
      .type('@gmail.com')
      .should('have.value', '@gmail.com');
    cy.get('@repeatEmailField').blur();

    cy.get('@repeatEmailField')
      .next()
      .should('have.text', 'Must follow this format: your@email.com')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@repeatEmailField').clear();
    cy.get('@repeatEmailField').type('lalala@gmail.com');
  });

  //----------------address/city/zipcode field------------------

  it('verifies address/city/zipcode field if required', function () {
    cy.get('input[name="address"]')
      .should('have.attr', 'data-required', 'true')
      .type('London{enter}');

    // cy.get('.dropdown li').eq(0).click();

    cy.get('input[name="city"]')
      .should('have.attr', 'data-required', 'true')
      .type('London')
      .should('have.value', 'London');

    cy.get('input[name="zipcode"]')
      .should('have.attr', 'data-required', 'true')
      .type('E1 6AN')
      .should('have.value', 'E1 6AN');
  });

  //----------------Phone field------------------

  it('verifies phone field', function () {
    //req: Can’t contain letters, spaces, or special characters
    cy.get('input[name="phone"]')
      .as('phoneField')
      .type('a')
      .should('have.value', 'a');
    cy.get('@phoneField').blur();
    cy.get('@phoneField')
      .next()
      .should(
        'have.text',
        "Can't contain letters, spaces or special characters"
      )
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@phoneField').clear();

    //req: Must contain 11 characters or less
    cy.get('@phoneField')
      .type('123456789101111111111111111111111111111111111111111')
      .should(
        'have.value',
        '123456789101111111111111111111111111111111111111111'
      );
    cy.get('@phoneField').blur();

    cy.get('@phoneField')
      .next()
      .should('have.text', 'Must contain 9 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    cy.get('@phoneField').clear();
    cy.get('@phoneField').type('123123123');
  });
});

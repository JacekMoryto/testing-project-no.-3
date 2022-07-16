/// <reference types="Cypress" />
import SignUp from '../lavazza/pageObjects/signUp';

describe('Cookie preservance before Sign-Up verification', function () {
  it('saves consent cookie from cookie banner', function () {
    cy.visit('/');
    cy.contains('ACCEPT ALL').click();
    Cypress.Cookies.preserveOnce('CONSENTMGR');
    cy.getCookie('CONSENTMGR').should('exist');
  });
});

//=========================================================================================================================

describe('HTML Sign-Up form verification', function () {
  const signUp = new SignUp();

  beforeEach(() => {
    cy.visit('/');
    cy.contains('LOGIN').click();
    cy.contains('SIGN UP', { timeout: 6000 }).click();
  });

  // it('my first test case', function () {
  //   cy.get('.sign-up')
  //     .find('h3')
  //     .first()
  //     .should('have.text', 'Sign up with Lavazza');
  // });

  it('successfuly signs up and an user presented with a popup', function () {
    signUp
      .getNameField()
      .type('Jane', { waitForAnimations: false })
      .should('have.value', 'Jane');
    signUp.getLastNameField().type('Lane').should('have.value', 'Lane');
    signUp
      .getEmailField()
      .type('user' + Math.floor(Math.random() * 1000) + '@dispostable.com')
      .should('include.value', '@dispostable.com');
    signUp
      .getPasswordField()
      .type('Test1234!')
      .should('have.value', 'Test1234!');
    signUp.getAgeCheckbox().check().should('be.checked');
    signUp.getFirstOptIn().check().should('be.checked');
    signUp.getSecondOptIn().check().should('be.checked');
    signUp.getSubmitButton().should('be.visible').click();
    signUp.getSuccessModal().should('be.visible');
  });

  //=========================================================================================================================

  it('shows validation error messages when inputs left empty and submit', function () {
    signUp.getSubmitButton().click();

    //inputs with proper validation error messages
    cy.get('.fieldset.-error .message').each((el, i) => {
      if (i === 0 || i === 1) {
        expect(el.text()).to.include('Required field');
      } else if (i === 2) {
        expect(el.text()).to.include('Email required');
      } else expect(el.text()).to.include('Password required');
    });

    //checkbox with proper css and 'required' attribute
    signUp.getAgeCheckbox().should((el) => {
      expect(el).to.have.attr('required');
      expect(el).to.have.css('border-bottom-color', 'rgb(255, 151, 151)');
    });

    //chebox label with proper css when error
    cy.get('#privateInputsForm [for="private-y-ageFlag"]').should(
      'have.css',
      'color',
      'rgb(255, 151, 151)'
    );

    //and opt-ins with proper css and 'required' attribute
    cy.get(
      '#privateInputsForm .inpcont-radio-consent [data-data="privacyRecall"]'
    ).should((el) => {
      expect(el).to.have.attr('required');
      expect(el).to.have.css('border-bottom-color', 'rgb(255, 151, 151)');
    });

    //opt-in labels with proper css when error
    cy.get('#privateInputsForm [for="private-privacyRecall"]').should(
      'have.css',
      'color',
      'rgb(255, 151, 151)'
    );
  });

  //=========================================================================================================================

  it('validates Name field', function () {
    //req: at least 2 characters
    signUp.getNameField().type('a{enter}').should('have.value', 'a');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Must contain at least 2 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');

    //label NAME with correct css when error
    cy.get('.fieldset.-error [for="su-firstName"]').should(
      'have.css',
      'color',
      'rgb(255, 151, 151)'
    );
    signUp.getNameField().clear();

    //req: no numbers
    signUp.getNameField().type('123{enter}').should('have.value', '123');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Cannot contain numbers & special characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
  });

  //=========================================================================================================================

  it('validates Last Name field', function () {
    //req: at least 2 characters
    signUp.getLastNameField().type('a{enter}').should('have.value', 'a');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Must contain at least 2 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');

    //label Name with correct css when error
    cy.get('.fieldset.-error [for="su-lastName"]').should(
      'have.css',
      'color',
      'rgb(255, 151, 151)'
    );
    signUp.getLastNameField().clear();

    //req: no numbers
    signUp.getLastNameField().type('123{enter}').should('have.value', '123');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Cannot contain numbers & special characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
  });

  //=========================================================================================================================

  it('validates Email field', function () {
    //req 1: at least 5 characters
    signUp.getEmailField().type('a{enter}').should('have.value', 'a');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Must contain at least 5 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');

    //label EMAIL with correct css when error
    cy.get('.fieldset.-error [for="su-email"]').should(
      'have.css',
      'color',
      'rgb(255, 151, 151)'
    );
    signUp.getEmailField().clear();

    //req 2: must follow correct format
    signUp
      .getEmailField()
      .type('@gmail.com{enter}')
      .should('have.value', '@gmail.com');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Must follow this format: your@email.com')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
    signUp.getEmailField().clear();

    //req 3: email already exist
    signUp.getNameField().type('Jane', { waitForAnimations: false });
    signUp.getLastNameField().type('Lane').should('have.value', 'Lane');
    signUp.getPasswordField().type('Test1234!');
    signUp.getAgeCheckbox().check();
    signUp.getFirstOptIn().check();
    signUp.getSecondOptIn().check();
    signUp
      .getEmailField()
      .type('us.dgt.test.block2@lavazza.com')
      .should('have.value', 'us.dgt.test.block2@lavazza.com');
    signUp.getSubmitButton().click();

    //correct error message + css
    cy.get('#privateInputsForm .fieldset.-error .message:nth-child(5)')
      .should('have.text', 'This email address already exists')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
  });

  //=========================================================================================================================

  it('validates Password field', function () {
    //req: at least 5 characters
    signUp.getPasswordField().type('a{enter}').should('have.value', 'a');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Must contain at least 8 characters')
      .and('have.css', 'color', 'rgb(255, 151, 151)');

    //label NAME with correct css when error
    cy.get('.fieldset.-error [for="su-password"]').should(
      'have.css',
      'color',
      'rgb(255, 151, 151)'
    );
    signUp.getPasswordField().clear();

    //req: must contain certain type of characters
    signUp
      .getPasswordField()
      .type('Test1234{enter}')
      .should('have.value', 'Test1234');

    //correct error message + css
    cy.get('.fieldset.-error .message')
      .should(
        'have.text',
        'Your password must contain at least one uppercase letter, one lowercase letter, a number from 0 to 9, and a special character (for example, *, ?, !...)'
      )
      .and('have.css', 'color', 'rgb(255, 151, 151)');
  });

  //=========================================================================================================================

  it('fill outs all the required fields, then blanks out one and submits', function () {
    signUp
      .getNameField()
      .type('Jane', { waitForAnimations: false })
      .should('have.value', 'Jane');
    signUp.getLastNameField().type('Lane').should('have.value', 'Lane');
    signUp
      .getEmailField()
      .type('user' + Math.floor(Math.random() * 1000) + '@dispostable.com')
      .should('include.value', '@dispostable.com');
    signUp
      .getPasswordField()
      .type('Test1234!')
      .should('have.value', 'Test1234!');
    signUp.getAgeCheckbox().check().should('be.checked');
    signUp.getFirstOptIn().check().should('be.checked');
    signUp.getSecondOptIn().check().should('be.checked');
    signUp.getNameField().clear();
    signUp.getSubmitButton().click();
    cy.get('.fieldset.-error .message')
      .should('have.text', 'Required field')
      .and('have.css', 'color', 'rgb(255, 151, 151)');
  });
});

//=========================================================================================================================

describe('social sign-up methods', function () {
  it('verifies Facebook sign up method if it returns status code of 200 when requested', function () {
    cy.request(
      'GET',
      'https://socialize.us1.gigya.com/socialize.getGmidTicket?apiKey=3_3EZd_ksO_R2Nr0lqbKJV2V30nK-FLHhxY0acDX19JE7mpdQtpoVp4sp-_uWxDlRJ&expires=3600&gmid=gmid.ver4.AcbH3FfBCQ.yh0A-WvHp_eI2r29-QCdbxmHEupY8l0lb4kWK607okQMUf1B7ptD2ea-xltl0pK7.VmMIr3nDw-5n8h8dm-p4QhYmTICN17wSAdsV6aMFw5wLFX_psC5134FY-P416dPsH_lOV4yg4_PqZgPcW2hhAA.sc3&pageURL=https%3A%2F%2Fwww.lavazza.us%2F&ucid=IlHLOkI1Gewy0xZeOYZZXA&sdk=js_latest&sdkBuild=12978&format=json'
    ).then(function (response) {
      expect(response.status).to.eql(200);
    });
    // .its('status')
    // .should('eq', 200);
  });

  it('verifies Gmail sign up method if it returns status code of 200 when requested', function () {
    cy.request(
      'GET',
      'https://socialize.us1.gigya.com/socialize.getGmidTicket?apiKey=3_3EZd_ksO_R2Nr0lqbKJV2V30nK-FLHhxY0acDX19JE7mpdQtpoVp4sp-_uWxDlRJ&expires=3600&gmid=gmid.ver4.AcbHxx7DFQ.YQSDBW1VjI70wcf67b9jUyPMu6wWSwvv51GQVnzBiv0NynC3zXbWHwP-UOqbTtxT.UGllj1eJxjiwRcl_wfgZm64nlXAwUH20DNxqdjQbyeu5W2PJqshHMLV58rIPgB5CI_-0P7THBAmh-Ny0BA8uDw.sc3&pageURL=https%3A%2F%2Fwww.lavazza.us%2F&ucid=h_vtMy_K4ccpxvObDgH6HA&sdk=js_latest&sdkBuild=12978&format=json'
    ).then(function (response) {
      expect(response.status).to.eql(200);
    });
  });

  it.skip('verifies Facebook sign up method if it returns status code of 200 when requested', function () {
    cy.intercept(
      'GET',
      'https://cdns.us1.gigya.com/sdk.config.get?apiKey=3_3EZd_ksO_R2Nr0lqbKJV2V30nK-FLHhxY0acDX19JE7mpdQtpoVp4sp-_uWxDlRJ&httpStatusCodes=true',
      { statusCode: 500 }
    ).as('facebook');
    cy.visit('/');
    cy.contains('LOGIN').click();
    cy.contains('SIGN UP', { timeout: 6000 }).click();
    cy.get('[data-provider="facebook"]').click();
    cy.request(
      'GET',
      'https://socialize.us1.gigya.com/socialize.getGmidTicket?apiKey=3_3EZd_ksO_R2Nr0lqbKJV2V30nK-FLHhxY0acDX19JE7mpdQtpoVp4sp-_uWxDlRJ&expires=3600&gmid=gmid.ver4.AcbH3FfBCQ.yh0A-WvHp_eI2r29-QCdbxmHEupY8l0lb4kWK607okQMUf1B7ptD2ea-xltl0pK7.VmMIr3nDw-5n8h8dm-p4QhYmTICN17wSAdsV6aMFw5wLFX_psC5134FY-P416dPsH_lOV4yg4_PqZgPcW2hhAA.sc3&pageURL=https%3A%2F%2Fwww.lavazza.us%2F&ucid=IlHLOkI1Gewy0xZeOYZZXA&sdk=js_latest&sdkBuild=12978&format=json'
    );

    cy.wait('@facebook').then((interception) => {
      console.log(interception.response.body);
      expect(interception.response.statusCode).to.eql(500);
    });
  });
});

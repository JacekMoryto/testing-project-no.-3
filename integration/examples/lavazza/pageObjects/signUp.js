class SignUp {
  getNameField() {
    return cy.get('[data-profile="firstName"]');
  }

  getLastNameField() {
    return cy.get('#privateInputsForm [data-profile="lastName"]');
  }

  getEmailField() {
    return cy.get('#privateInputsForm input[type="email"]');
  }

  getPasswordField() {
    return cy.get('#privateInputsForm input[type="password"]');
  }

  getAgeCheckbox() {
    return cy.get('#privateInputsForm input[data-data="ageflag"]');
  }

  getFirstOptIn() {
    return cy.get(
      '#privateInputsForm [data-data="privacyRecall"]:nth-child(1)'
    );
  }

  getSecondOptIn() {
    return cy.get(
      '#privateInputsForm [data-data="privacyProfiling"]:nth-child(1)'
    );
  }

  getSubmitButton() {
    return cy.get('#privateInputsForm [type="button"]');
  }

  getSuccessModal() {
    return cy.get('.modal .email-verification');
  }
}

export default SignUp;

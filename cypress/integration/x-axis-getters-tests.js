var testSite = Cypress.env("testSite")

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
    .invoke("scrollTop")
    .should("equal", value);
}
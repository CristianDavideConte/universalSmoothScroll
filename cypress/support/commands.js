// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.addAll({
    bodyScrollLeftShouldToBe(value) {
        cy.get("body")
        .should("have.prop", "scrollLeft")
        .and("eq", value);
    },
    bodyScrollTopShouldToBe(value) {
        cy.get("body")
        .should("have.prop", "scrollTop")
        .and("eq", value);
    },
    /** 
     * Input parameters structure:
     *  command = uss.nameOfMethod
     *  failingValues = {
     *   0 : [value1, value2..., value7],
     *   1 : [value1, value2],
     *   2 : [],
     *    ...
     *  }
     *  actionAftertest = (res, v1, v2, v3, v4, v5, v6, v7) => {expect(...).to...}
     */
    testFailingValues(command, failingValues = {}, actionAfterTest = (res) => expect(res).to.be.undefined) {  
        for(let [key, failingValueArr] of Object.entries(failingValues)) {
            const [v1, v2, v3, v4, v5, v6, v7] = failingValueArr;
            actionAfterTest(
                command(v1, v2, v3, v4, v5, v6, v7),
                v1, v2, v3, v4, v5, v6, v7
            );
        }
    }
});
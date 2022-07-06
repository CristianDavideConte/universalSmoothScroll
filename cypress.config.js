module.exports = {
  retries: 2,
  defaultCommandTimeout: 4000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:8080/tests-pages/",
    specPattern: [
      "./cypress/e2e/scrollBy-tests.cy.js", 
      "./cypress/e2e/*.cy.js"
    ]
  },
}

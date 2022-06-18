Cypress.config("defaultCommandTimeout", Cypress.env("preferredTimeout"));

function bodyScrollLeftShouldToBe(value) {
    cy.get("body")
      .should("have.prop", "scrollLeft")
      .and("eq", value);
}

function bodyScrollTopShouldToBe(value) {
    cy.get("body")
      .invoke("scrollTop")
      .should("equal", value);
}

describe("getMinAnimationFrame-Body", function() {
    var uss;
    it("Tests the getMinAnimationFrame method", function() {
        cy.visit("index.html") 
        cy.window()
          .then((win) => {
              uss = win.uss;
              uss._containersData = new Map();  

              //DEFAULT_YSTEP_LENGTH
              const _defaultWinHeight = win.innerHeight; 
              const _defaultYStepLegth = Math.max(1, Math.abs(38 - 20 / 140 * (_defaultWinHeight - 789)));
              const _defaultValue = _defaultWinHeight / _defaultYStepLegth;
              expect(uss.getMinAnimationFrame()).to.equal(_defaultValue); 

              uss.setMinAnimationFrame(10);
              expect(uss.getMinAnimationFrame()).to.equal(10); 
          });        
    })
})


describe("getWindowHeight-Body", function() {
    var uss;
    const resolutions = [[640, 480],
                         [1280, 720], 
                         [1920, 1080], 
                         [2560, 1440]];
    resolutions.forEach(res => {
        it("Tests the getWindowHeight method", function() {
            cy.viewport(res[0], res[1]);
            cy.visit("index.html") 
            cy.window()
              .then((win) => {
                  uss = win.uss;
                  uss._containersData = new Map();  
    
                  expect(uss.getWindowHeight()).to.equal(win.innerHeight); 
              });        
        });
    });    
})
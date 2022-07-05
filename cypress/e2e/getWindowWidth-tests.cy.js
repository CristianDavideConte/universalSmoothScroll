const { constants } = require("../support/constants");

describe("getWindowWidth", function() {
    let uss;
    const resolutions = [[640, 480],
                         [1280, 720], 
                         [1920, 1080], 
                         [2560, 1440]];
    resolutions.forEach(res => {
        it("Tests the getWindowWidth method", function() {
            cy.viewport(res[0], res[1]);
            cy.visit("getWindowWidth-tests.html"); 
            cy.window()
              .then((win) => {
                  uss = win.uss;    
                  expect(uss.getWindowWidth()).to.equal(win.innerWidth); 
              });        
        });
    });    
})

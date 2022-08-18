const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getScrollYCalculator-tests.html"); 
})

describe("getScrollYCalculator", function() {
    let uss;
    let result = false;
    it("Tests the getScrollYCalculator method", function() {
      cy.window()
        .then((win) => {
            uss = win.uss;
                              
            cy.testFailingValues(uss.getScrollYCalculator, {
              0: [constants.failingValuesNoUndefined]
            },
            (res, v1, v2, v3, v4, v5, v6, v7) => {
              expect(res).to.throw(constants.defaultUssException);
            })
            .then(() => {
              const _document = win.document.documentElement;
              const _body = win.document.body;

              const _elementScrollableOnYAxis = win.document.getElementById("scrollable-y");
              const _elementScrollableOnXAxis = win.document.getElementById("scrollable-x");
              const _positionFixedElement = win.document.getElementById("position-fixed");
              const _randomElement = win.document.getElementById("random-element");

              const _elements = [
                  _document,
                  _body,
                  _elementScrollableOnYAxis,
                  _elementScrollableOnXAxis,
                  _positionFixedElement,
                  _randomElement
              ];

              _elements.forEach(el => expect(uss.getScrollYCalculator(el)()).to.equal(el.scrollTop));
              expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);

              cy.waitForUssCallback( 
                (resolve) => {
                    _elements.forEach(
                        el => {
                            uss.scrollYTo(
                                Math.random() * el.scrollHeight, 
                                el, 
                                () => {
                                    result = uss.getScrollYCalculator(el)() === el.scrollTop;
                                    if(!result || _elements.filter(el => uss.isScrolling(el)).length <= 0) {
                                        uss.stopScrollingAll(resolve);
                                    }
                                }
                            );
                        }
                    );
                }
              ).then(
                  () => {
                  expect(result).to.be.true;
                  expect(uss.getScrollYCalculator(win)()).to.equal(win.scrollY);
                }
              );
            });
        });        
    });
})
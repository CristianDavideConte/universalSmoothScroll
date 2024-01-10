import * as uss from "../../src/main/uss.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getScrollXCalculator-tests.html"); 
})

describe("getScrollXCalculator", function () {
  let result = false;
    
  it("Tests the getScrollXCalculator method", function () {
    cy.window()
      .then((win) => {
        cy.testFailingValues(uss.getScrollXCalculator, {
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

            _elements.forEach(el => expect(uss.getScrollXCalculator(el)()).to.equal(el.scrollLeft));
            expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);

            cy.waitForUssCallback(
              (resolve) => {
                _elements.forEach(
                  el => {
                    uss.scrollXTo(
                      Math.random() * el.scrollWidth,
                      el,
                      () => {
                        result = uss.getScrollXCalculator(el)() === el.scrollLeft;
                                    
                        if (!result || _elements.filter(el => uss.isScrolling(el)).length <= 0) {
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
                expect(uss.getScrollXCalculator(win)()).to.equal(win.scrollX);
              }
            );
          });
      });
  });
});
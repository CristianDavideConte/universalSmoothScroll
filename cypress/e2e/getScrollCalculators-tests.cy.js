import * as uss from "../../src/main/uss.js";
import * as common from "../../src/main/common.js";

const { constants } = require("../support/constants");

beforeEach(() => {
  cy.visit("getScrollCalculators-tests.html");

  //Speeds up the tests, there's no need to wait for the scroll-animations.
  uss.setStepLength(Math.max(common.HIGHEST_SAFE_SCROLL_POS, common.HIGHEST_SAFE_SCROLL_POS));
})

describe("getScrollCalculators", function () {
  let result = false;
    
  it("Tests the getScrollCalculators method", function () {
    cy.window()
      .then((win) => {
        cy.testFailingValues(uss.getScrollCalculators, {
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

            _elements.forEach(el => {
              const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(el);
              expect(_scrollXCalculator()).to.equal(el.scrollLeft)
              expect(_scrollYCalculator()).to.equal(el.scrollTop)
            });
            expect(uss.getScrollCalculators(win)[0]()).to.equal(win.scrollX);
            expect(uss.getScrollCalculators(win)[1]()).to.equal(win.scrollY);

            cy.waitForUssCallback(
              (resolve) => {
                _elements.forEach(
                  el => {
                    uss.scrollTo(
                      Math.random() * el.scrollWidth,
                      Math.random() * el.scrollHeight,
                      el,
                      () => {
                        const [_scrollXCalculator, _scrollYCalculator] = uss.getScrollCalculators(el);

                        result = _scrollXCalculator() === el.scrollLeft &&
                          _scrollYCalculator() === el.scrollTop;

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
                expect(uss.getScrollCalculators(win)[0]()).to.equal(win.scrollX);
                expect(uss.getScrollCalculators(win)[1]()).to.equal(win.scrollY);
              }
            );
          });
      });
  });
});
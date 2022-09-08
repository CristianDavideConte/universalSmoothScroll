import { SmoothScrollBuilder } from "./uss-builder-smoothscroll.js";

export class SmoothScrollbarBuilder extends SmoothScrollBuilder {

    //Parameters already sanitized.
    constructor(container, options) {
        super(container, options);
    }

    build() {

    }

    get originalContainer() {
        return this.container.originalContainer;
    }

    get originalBuilder() {
        return this.container.originalBuilder;
    }
}
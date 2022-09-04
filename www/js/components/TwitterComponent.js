import BaseComponent from "./BaseComponent.js";

export default class TwitterComponent extends BaseComponent {
    static name = "twitter";

    constructor(node) {
        super(node);

        this.$ = {
            input: this.$body.querySelector("input"),
        };
    }

    get username() {
        return this.$.input.value;
    }

    set username(val) {
        this.$.input.value = val;
    }
}

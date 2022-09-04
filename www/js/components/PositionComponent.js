import BaseComponent from "./BaseComponent.js";

export default class PositionComponent extends BaseComponent {
    static HIDDEN = true;

    static name = "position";

    constructor(node) {
        super(node);

        this.$ = {
            xInput: this.$body.querySelector(".x-input"),
            yInput: this.$body.querySelector(".y-input")
        };

        const updatePosition = () => {
            this.node.pos = {
                x: +this.$.xInput.value,
                y: +this.$.yInput.value
            }
        }

        this.$.xInput.addEventListener("input", updatePosition);
        this.$.yInput.addEventListener("input", updatePosition);
    }

    get pos() {
        return this.node.pos;
    }

    set pos(val) {
        this.$.xInput.value = val.x;
        this.$.yInput.value = val.y;
    }

    update() {
        this.pos = this.node.pos;
    }
}

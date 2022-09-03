import Utils from "./Utils.js";

export default class Node {
    constructor($parent) {
        this._pos = {x: 0, y: 0};
        this._scale = 1;
        this.$body = Utils.createSVGElement("g", $parent);
    }

    updateMatrix() {
        this.$body.setAttribute(
            "transform",
            "matrix(" + [
                this._scale, 0,
                0, this._scale,
                this._pos.x, this._pos.y
            ].join(",") + ")"
        );
    }

    get pos() {
        return this._pos;
    }

    set pos({x, y}) {
        this._pos = {x, y};

        this.updateMatrix();
    }

    get scale() {
        return this._scale;
    }

    set scale(factor) {
        this._scale = factor;

        this.updateMatrix();
    }

    move(x, y) {
        this.pos = {x: this._pos.x + x, y: this._pos.y + y};
    }

    scaleBy(factor, x, y) {
        this._scale *= factor;

        this._pos.x = this._pos.x
            - (this._pos.x - x)
            + factor * (this._pos.x - x);
        this._pos.y = this._pos.y
            - (this._pos.y - y)
            + factor * (this._pos.y - y);

        this.updateMatrix();
    }
}

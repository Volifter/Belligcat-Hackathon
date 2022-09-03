import Utils from "./Utils.js";

export default class Node {
    constructor() {
        this._pos = {x: 0, y: 0};
        this.$body = Utils.createSVGElement(
            "circle",
            null,
            {
                r: 100,
                fill: "#fff",
                stroke: "#000",
                "stroke-width": "4px",
                class: "node"
            }
        );
        this.edgesFrom = [];
        this.edgesTo = [];

        this.$body.__node = this;
    }

    get pos() {
        return this._pos;
    }

    set pos({x, y}) {
        this._pos = {x, y};

        this.$body.setAttribute("cx", x);
        this.$body.setAttribute("cy", y);

        this.edgesFrom.forEach(edge => edge.update());
        this.edgesTo.forEach(edge => edge.update());
    }

    move(x, y) {
        this.pos = {x: this._pos.x + x, y: this._pos.y + y};
    }

    addEdgeFrom(edge) {
        this.edgesFrom.push(edge);
    }

    addEdgeTo(edge) {
        this.edgesTo.push(edge);
    }
}

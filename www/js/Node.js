import Utils from "./Utils.js";

export default class Node {
    static nextId = 1;

    static $defs = document.querySelector("svg defs");

    static $components = document.querySelector(".components");

    constructor(id) {
        this.id = id || Node.nextId;

        Node.nextId = Math.max(Node.nextId, this.id + 1);

        this.isSelected = false;
        this._pos = {x: 0, y: 0};
        this.$body = Utils.createSVGElement(
            "circle",
            null,
            {
                r: 100,
                fill: `url(#node-fill-${this.id})`,
                stroke: "#000",
                "stroke-width": "4px",
                class: "node"
            }
        );
        this.$image = Node.addImagePattern(this.$body, this.id);
        this.edgesFrom = [];
        this.edgesTo = [];

        this.components = {};

        this.$body.__node = this;
    }

    get isPickingNode() {
        return !!this.components["edges"]?.isPickingNode;
    }

    static addImagePattern($body, id) {
        const $pattern = Utils.createSVGElement(
            "pattern",
            Node.$defs,
            {
                id: "node-fill-" + id,
                width: 1,
                height: 1
            }
        );

        Utils.createSVGElement(
            "rect",
            $pattern,
            {width: 200, height: 200, fill: "#fff"}
        );

        return Utils.createSVGElement(
            "image",
            $pattern,
            {width: 200, height: 200}
        );
    }

    get pos() {
        return this._pos;
    }

    set pos({x, y}) {
        this._pos = {x: Math.round(x), y: Math.round(y)};

        this.$body.setAttribute("cx", x);
        this.$body.setAttribute("cy", y);

        this.edgesFrom.forEach(edge => edge.update());
        this.edgesTo.forEach(edge => edge.update());

        this.components["position"].update();
    }

    move(x, y) {
        this.pos = {x: this._pos.x + x, y: this._pos.y + y};
    }

    addEdgeFrom(edge) {
        this.edgesFrom.push(edge);
    }

    removeEdgeFrom(node) {
        const idx = this.edgesFrom.findIndex(edge => edge.nodeFrom === node);

        if (idx != -1)
            this.edgesFrom.splice(idx, 1);
    }

    addEdgeTo(edge) {
        this.edgesTo.push(edge);
    }

    removeEdgeTo(node) {
        const idx = this.edgesTo.findIndex(edge => edge.nodeTo === node);

        if (idx != -1)
            this.edgesTo.splice(idx, 1);
    }

    removeEdge(edge) {
        const idx_to = this.edgesTo.indexOf(edge);

        if (idx_to != -1)
            this.edgesTo.splice(idx_to, 1);

        const idx_from = this.edgesFrom.indexOf(edge);

        if (idx_from != -1)
            this.edgesFrom.splice(idx_from, 1);
    }

    removeAllEdgesFrom() {
        this.edgesFrom.forEach(edge => {
            this.removeEdge(edge);
            edge.nodeTo.removeEdge(edge);
            edge.$line.remove();
        });
    }

    renderComponents() {
        Node.$components.innerHTML = "";
        Object.values(this.components).forEach(component => component.render());
    }

    select() {
        this.isSelected = true;
        this.$body.classList.add("selected");
    }

    deselect() {
        this.isSelected = false;
        this.$body.classList.remove("selected");
    }

    addComponent(component) {
        const name = component.constructor.name;

        if (this.components[name])
            return alert(`Component "${name}" already exists on this node`);

        this.components[name] = component;

        return true;
    }

    removeComponent(name) {
        delete this.components[name];

        this.renderComponents();
    }

    pickNode(node) {
        return this.components["edges"]?.pickNode(node);
    }
}

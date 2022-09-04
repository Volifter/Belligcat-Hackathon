import BaseComponent from "./BaseComponent.js";

export default class EdgesComponent extends BaseComponent {
    static name = "edges";

    constructor(node) {
        super(node);

        this.$ = {
            newEdgeButton: this.$body.querySelector(".new-edge-button"),
            list: this.$body.querySelector("ul")
        };
        this.links = [];

        this.$newEdge = null;

        this.$.newEdgeButton.addEventListener("click", () => {
            if (this.$newEdge)
                return this.unpickNode();

            this.$newEdge = document.createElement("li");
            this.$newEdge.textContent = "<click on a node>";
            this.$newEdge.classList.add("picking");

            this.$.list.append(this.$newEdge);
        });
    }

    get isPickingNode() {
        return !!this.$newEdge;
    }

    unpickNode() {
        this.$newEdge.remove();
        this.$newEdge = null;
    }

    pickNode(node) {
        if (!this.$newEdge)
            return false;

        if (!node || node.id == this.node.id || this.links.includes(node.id))
            return this.unpickNode();

        this.$newEdge.classList.remove("picking");
        this.$newEdge.textContent = "#" + node.id;
        this.links.push(node.id);
        this.$newEdge = null;

        return true;
    }

    destroy() {
        this.node.removeAllEdgesFrom();
    }
}

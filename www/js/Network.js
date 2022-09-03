import Utils from "./Utils.js";
import View from "./View.js";
import Edge from "./Edge.js";

export default class Network {
    constructor($svg) {
        this.$root = $svg;
        this.$view = new View($svg);
        this.layers = {
            $edges: Utils.createSVGElement("g", this.$view.$body),
            $nodes: Utils.createSVGElement("g", this.$view.$body),
            $hints: Utils.createSVGElement("g", this.$view.$body)
        }
        this.nodes = [];
        this.isMouseDown = false;
        this.isGlobalDrag = false;
        this.draggedNodes = [];

        this.$root.addEventListener("mousedown", e => this.processMouseDown(e));
        this.$root.addEventListener("mousemove", e => this.processMouseMove(e));
        this.$root.addEventListener("mouseup", () => this.processMouseUp());

        this.$root.addEventListener("mousewheel", e => this.processScroll(e));
    }

    processMouseDown(e) {
        this.isMouseDown = true;
        this.draggedNodes = [e.target.__node];
        this.isGlobalDrag = !this.draggedNodes[0];

        this.$root.classList.add("dragged");
    }

    processMouseMove(e) {
        if (!this.isMouseDown)
            return;

        if (this.isGlobalDrag)
            return this.$view.move(e.movementX, e.movementY);

        this.draggedNodes.forEach(node => node.move(
            e.movementX / this.$view.scale,
            e.movementY / this.$view.scale
        ));
    }

    processMouseUp() {
        this.draggedNodes = [];
        this.isMouseDown = false;
        this.$root.classList.remove("dragged");
    }

    processScroll(e) {
        const factor = 1 / (1 + Math.exp(.01 * e.deltaY)) + .5;

        this.$view.scaleBy(factor, e.offsetX, e.offsetY);

        e.preventDefault();
    }

    addNode(node) {
        this.layers.$nodes.append(node.$body);
        this.nodes.push(node);
    }

    linkNodes(from, to) {
        const edge = new Edge(
            from,
            to,
            Utils.createSVGElement(
                "line",
                this.layers.$edges,
                {class: "edge"}
            )
        );

        from.addEdgeFrom(edge);
        to.addEdgeTo(edge);
        edge.update();
    }
}

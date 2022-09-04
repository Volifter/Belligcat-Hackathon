import Utils from "./Utils.js";
import View from "./View.js";
import Node from "./Node.js";
import Edge from "./Edge.js";

export default class Network {
    constructor($svg, held_keys) {
        this.$root = $svg;
        this.heldKeys = held_keys;
        this.view = new View($svg);
        this.layers = {
            $edges: Utils.createSVGElement("g", this.view.$body),
            $nodes: Utils.createSVGElement("g", this.view.$body),
            $hints: Utils.createSVGElement("g", this.view.$body)
        }
        this.$ = {
            newComponent: document.querySelector(".new-component")
        };
        this.nodes = [];
        this.mouseDownPos = {x: 0, y: 0};
        this.isMouseDown = false;
        this.isGlobalDrag = false;
        this.selectedNodes = {};

        this.$root.addEventListener("mousedown", e => this.processMouseDown(e));
        this.$root.addEventListener("mousemove", e => this.processMouseMove(e));
        this.$root.addEventListener("mouseup", e => this.processMouseUp(e));

        this.$root.addEventListener("mousewheel", e => this.processScroll(e));
    }

    processMouseDown(e) {
        this.$root.classList.add("dragged");

        const target_node = e.target.__node;

        this.mouseDownPos = {x: e.offsetX, y: e.offsetY};
        this.isMouseDown = true;
        this.isGlobalDrag = !target_node;

        const nodes = Object.values(this.selectedNodes);

        if (nodes.length == 1 && nodes[0].isPickingNode) {
            if (nodes[0].pickNode(target_node))
                this.linkNodes(nodes[0], target_node);
            this.isGlobalDrag = true;
            return;
        }

        if (!this.heldKeys["Shift"] && !this.isGlobalDrag)
            this.deselectAllNodes();

        if (target_node)
            this.selectNode(target_node);
    }

    processMouseMove(e) {
        if (!this.isMouseDown)
            return;

        if (this.isGlobalDrag)
            return this.view.move(e.movementX, e.movementY);

        Object.values(this.selectedNodes).forEach(node => node.move(
            e.movementX / this.view.scale,
            e.movementY / this.view.scale
        ));
    }

    processMouseUp(e) {
        this.isMouseDown = false;
        this.$root.classList.remove("dragged");

        const node = e.target.__node;

        if (
            this.mouseDownPos.x != e.offsetX
            || this.mouseDownPos.y != e.offsetY
        )
            return;

        if (!node || this.isGlobalDrag)
            return this.deselectAllNodes();

        if (!this.heldKeys["Shift"])
            this.deselectAllNodes();

        this.selectNode(node);
    }

    processScroll(e) {
        const factor = 1 / (1 + Math.exp(.01 * e.deltaY)) + .5;

        this.view.scaleBy(factor, e.offsetX, e.offsetY);

        e.preventDefault();
    }

    addNode(modules) {
        const node = new Node;

        this.layers.$nodes.append(node.$body);
        this.nodes.push(node);

        modules["position"].addComponent("position", node);
        return node;
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

    renderComponents() {
        const nodes = Object.values(this.selectedNodes);

        this.$.newComponent.classList.toggle("shown", nodes.length == 1);

        if (nodes.length == 1)
            nodes[0].renderComponents();
    }

    selectNode(node) {
        node.select();
        this.selectedNodes[node.id] = node;
        this.renderComponents();
    }

    deselectNode(node) {
        node.deselect();
        delete this.selectedNodes[node.id];
        this.renderComponents();
    }

    deselectAllNodes() {
        Object.values(this.selectedNodes).forEach(selected_node => {
            this.deselectNode(selected_node);
        });
    }

    addComponentToCurrentNode(module, component_name) {
        const nodes = Object.values(this.selectedNodes);

        if (nodes.length != 1)
            return;

        module.addComponent(component_name, nodes[0]);

        this.renderComponents();
    }

    deleteSelectedNodes() {
        Object.values(this.selectedNodes).forEach(node => node.$body.remove());
        this.nodes = this.nodes.filter(node => !this.selectedNodes[node.id]);
        this.selectedNodes = {};
    }

    async loadTwitterFollowers(modules) {
        const nodes = Object.values(this.selectedNodes);

        if (nodes.length != 1)
            return alert("Please select exactly one node");

        const node = nodes[0];
        const comp = node.components["twitter"]

        if (!comp)
            return alert("Node does not have a twitter component");

        if (!comp.username)
            return alert("Username is empty");

        const {following} = await fetch(
            "/api/twitter/following/" + encodeURIComponent(comp.username)
        ).then(res => res.json());

        Object.keys(following).forEach((name, i) => {
            const child = this.addNode(modules);

            child.pos = {x: node.pos.x + 300, y: node.pos.y + i * 250};
            modules["twitter"].addComponent("twitter", child);

            child.components["twitter"].username = name;

            this.linkNodes(node, child);
        });
    }
}

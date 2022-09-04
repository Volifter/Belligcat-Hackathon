import Utils from "./Utils.js";
import Network from "./Network.js";

import PositionModule from "./modules/PositionModule.js";
import ImageModule from "./modules/ImageModule.js";
import EdgesModule from "./modules/EdgesModule.js";
import TwitterModule from "./modules/TwitterModule.js";

export default class App {
    static MODULES = Object.fromEntries([
        PositionModule,
        ImageModule,
        EdgesModule,
        TwitterModule
    ].map(proto => [proto.name, new proto]));

    constructor() {
        this.$ = {
            svg: document.querySelector("svg"),
            componentSelect: document.querySelector(".new-component select"),
            newNodeButton: document.querySelector(".new-node-button"),
            deleteNodeButton: document.querySelector(".delete-node-button"),
            twitterLoadButton: document.querySelector(".twitter-load-button"),
            exportButton: document.querySelector(".export-button"),
        };
        this.keyHandlers = {};
        this.heldKeys = {};
        this.network = new Network(this.$.svg, this.heldKeys);

        this.$.componentSelect.addEventListener("change", e => {
            const [module_name, component_name] = e.target.value.split(".");
            const module = App.MODULES[module_name];

            this.network.addComponentToCurrentNode(module, component_name);

            e.target.value = "";
            e.preventDefault();
        });

        this.$.newNodeButton.addEventListener("click", () => this.addNode());
        this.addHandler("n", () => this.addNode());

        this.$.deleteNodeButton.addEventListener("click", () => {
            this.network.deleteSelectedNodes();
        });
        this.addHandler("Backspace", () => this.network.deleteSelectedNodes());

        this.$.twitterLoadButton.addEventListener("click", async () => {
            try {
                this.$.twitterLoadButton.disabled = true;
                await this.network.loadTwitterFollowers(App.MODULES);
            } finally {
                this.$.twitterLoadButton.disabled = false;
            }
        });
        this.$.exportButton.addEventListener("click", () => this.download());
    }

    static setupLeftPanelSections() {
        const $sections = document.querySelectorAll(".left-panel section");
        let expanded = null;

        for (const $section of $sections) {
            const $header = $section.querySelector("h1");

            $header.addEventListener("click", () => {
                if (expanded == $section) {
                    expanded.style.maxHeight = null;
                    expanded = null;
                    return $section.classList.remove("expanded");
                }

                expanded?.classList.remove("expanded");

                if (expanded)
                    expanded.style.maxHeight = null;

                expanded = $section;

                expanded.classList.add("expanded");
                expanded.style.maxHeight = expanded.scrollHeight + "px";
            });
        }
    }

    static setupPanels() {
        Utils.setToggleable(
            ".left-panel", "expanded", ".left-panel > .arrow"
        );
        Utils.setToggleable(
            ".right-panel", "expanded", ".right-panel > .arrow"
        );

        App.setupLeftPanelSections();
    }

    addHandler(key, handler) {
        if (this.keyHandlers[key])
            return console.warn(`Duplicate key handler for ${key}`);

        this.keyHandlers[key] = handler;
    }

    setupComponents() {
        Object.values(App.MODULES).forEach(module => {
            Object.values(module.constructor.COMPONENTS).forEach(comp => {
                const name = comp.name;

                if (comp.HIDDEN)
                    return;

                const option = document.createElement("option");

                option.value = module.constructor.name + "." + name;
                option.textContent = Utils.capitalize(name);

                this.$.componentSelect.append(option);
            });
        });
    }

    setup() {
        App.setupPanels();

        this.setupComponents();

        this.addHandler("[", () => {
            document.querySelector(".left-panel").classList.toggle("expanded");
        });
        this.addHandler("]", () => {
            document.querySelector(".right-panel").classList.toggle("expanded");
        });

        window.addEventListener("keydown", ({key}) => {
            this.heldKeys[key] = true;
            this.keyHandlers[key]?.();
        });
        window.addEventListener("keyup", ({key}) => {
            delete this.heldKeys[key];
        });
    }

    addNode() {
        const node = this.network.addNode(App.MODULES);

        node.pos = {
            x: this.$.svg.clientWidth / 2,
            y: this.$.svg.clientHeight / 2
        };

        return node;
    }

    download() {
        const data = this.$.svg.outerHTML;
        const svgBlob = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
        const svgUrl = URL.createObjectURL(svgBlob);
        const a = document.createElement("a");

        a.href = svgUrl;
        a.download = "graph.svg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

import Utils from "./Utils.js";

export default class App {
    constructor() {
        this.keyHandlers = {};
    }

    static setupPanelSections(panel) {
        let expanded = null;

        for (const $section of panel.querySelectorAll("section")) {
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

        App.setupPanelSections(document.querySelector(".left-panel"));
        App.setupPanelSections(document.querySelector(".right-panel"));
    }

    addHandler(key, handler) {
        if (this.keyHandlers[key])
            return console.warn(`Duplicate key handler for ${key}`);

        this.keyHandlers[key] = handler;
    }

    setup() {
        App.setupPanels();

        this.addHandler("[", () => {
            document.querySelector(".left-panel").classList.toggle("expanded");
        });
        this.addHandler("]", () => {
            document.querySelector(".right-panel").classList.toggle("expanded");
        });

        window.addEventListener("keydown", ({key}) => {
            this.keyHandlers[key]?.();
        });
    }
}

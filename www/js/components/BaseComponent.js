export default class BaseComponent {
    static name = "base";

    static $container = document.querySelector(".components");

    constructor(node) {
        this.node = node;
        this.$body = document.getElementById(
            this.constructor.name + "-component-template"
        ).content.children[0].cloneNode(true);

        const $deleteButton = this.$body.querySelector("button.delete");

        $deleteButton?.addEventListener("click", () => {
            this.node.removeComponent(this.constructor.name);
            this.destroy();
        });
    }

    update() {}

    render() {
        this.constructor.$container.append(this.$body);
        this.update();
    }

    destroy() {}
}

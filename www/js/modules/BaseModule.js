export default class BaseModule {
    static COMPONENTS = {};

    constructor() {}

    addComponent(name, node) {
        const prototype = this.constructor.COMPONENTS[name];

        if (!prototype)
            return console.warn(
                `Invalid component for ${this.constructor.name}: ${name}`
            );

        const component = new prototype(node);

        if (node.addComponent(component))
            this.registerComponent(component);
    }

    registerComponent() {}
}

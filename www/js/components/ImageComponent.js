import Utils from "../Utils.js";
import BaseComponent from "./BaseComponent.js";

export default class ImageComponent extends BaseComponent {
    static name = "image";

    constructor(node) {
        super(node);

        this.imageData = null;

        this.$ = {
            button: this.$body.querySelector(".pick-button"),
            preview: this.$body.querySelector(".image-preview")
        };

        this.$.button.addEventListener("click", () => this.pickImage());
        this.$.preview.addEventListener("click", () => this.pickImage());
    }

    async pickImage() {
        const file = await Utils.pickFile("image/*");

        this.imageData = await Utils.convertImageToBase64(file);
        console.log(this.imageData);
        console.log(this.node);

        this.update();
    }

    update() {
        if (!this.imageData)
            return;

        this.node.$image.setAttribute("href", this.imageData);
        this.$.preview.style.backgroundImage = `url('${this.imageData}')`;
        this.$.preview.style.backgroundSize = "contain";
    }
}

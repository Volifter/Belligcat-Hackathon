import BaseModule from "./BaseModule.js";
import ImageComponent from "../components/ImageComponent.js";

export default class ImageModule extends BaseModule {
    static name = "image";

    static COMPONENTS = {
        "image": ImageComponent
    };
}

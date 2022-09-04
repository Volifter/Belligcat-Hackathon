import BaseModule from "./BaseModule.js";
import TwitterComponent from "../components/TwitterComponent.js";

export default class TwitterModule extends BaseModule {
    static name = "twitter";

    static COMPONENTS = {
        "twitter": TwitterComponent
    };
}

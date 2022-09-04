import BaseModule from "./BaseModule.js";
import EdgesComponent from "../components/EdgesComponent.js";

export default class EdgesModule extends BaseModule {
    static name = "edges";

    static COMPONENTS = {
        "edges": EdgesComponent
    };
}

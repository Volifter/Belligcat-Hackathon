import BaseModule from "./BaseModule.js";
import PositionComponent from "../components/PositionComponent.js";

export default class PositionModule extends BaseModule {
    static name = "position";

    static COMPONENTS = {
        "position": PositionComponent
    };
}

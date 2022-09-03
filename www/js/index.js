import App from "./App.js";
import Network from "./Network.js";
import Node from "./Node.js";

{




    window.addEventListener("load", () => {
        window.app = new App;

        app.setup();

        const network = new Network(document.querySelector("svg"));
        const node_a = new Node();
        const node_b = new Node();

        network.addNode(node_a);
        network.addNode(node_b);

        node_b.pos = {x: 400, y: 150};

        network.linkNodes(node_a, node_b);

        window.n = network;
    });
}

import App from "./App.js";

{
    window.addEventListener("load", () => {
        window.app = new App;

        app.setup();
    });
}

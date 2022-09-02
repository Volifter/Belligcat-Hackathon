const express = require("express");
const path = require("path");

class Main {
    static async main() {
        const port = process.env.PORT ?? 8080;
        const app = express();

        app.get("/", (req , res) => res.sendFile(
            path.join(__dirname, "../index.html")
        ));

        app.use(express.static(path.join(__dirname, "../www")));

        app.listen(port, () => {
            console.info("Server listening on port", port);
        });
    }
}

void Main.main();

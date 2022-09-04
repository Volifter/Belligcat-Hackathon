const express = require("express");
const path = require("path");
const TwitterModule = require("./modules/Twitter");

const twitter = require("../config/twitter.json");

class Main {
    static async main() {
        const port = process.env.PORT ?? 8080;
        const app = express();
        const twitter_module = new TwitterModule({
            username: twitter.username,
            password: twitter.password
        });

        void twitter_module.login();

        app.get("/", (req , res) => res.sendFile(
            path.join(__dirname, "../index.html")
        ));

        app.use(express.static(path.join(__dirname, "../www")));

        app.listen(port, () => {
            console.info("Server listening on port", port);
        });


        app.get("/api/twitter/following/:username", async (req, res) => {
            try {
                const following = await twitter_module.getFollowing(
                    req.params.username
                );

                res.send({following});
            } catch (e) {
                res.status(500).send({error: e});
            }
        });
    }
}

void Main.main();

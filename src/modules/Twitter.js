const puppeteer = require("puppeteer");

class TwitterModule {
    static USER_AGENT = [
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6)",
        "AppleWebKit/537.36 (KHTML, like Gecko)",
        "Chrome/104.0.0.0 Safari/537.36"
    ].join(" ");

    constructor({username, password}) {
        this.username = username;
        this.password = password;
        this.browser = null;
    }

    async openPage() {
        const page = await this.browser.newPage();

        page.setUserAgent(TwitterModule.USER_AGENT);

        return page;
    }

    async login() {
        this.browser = await puppeteer.launch();

        const page = await this.openPage();

        const SELECTORS = {
            USERNAME: "input[autocomplete=username]",
            PASSWORD: "input[autocomplete=current-password]"
        }

        await page.goto("https://twitter.com/i/flow/login");
        await page.waitForSelector(SELECTORS.USERNAME);
        await page.type(SELECTORS.USERNAME, this.username + "\n");
        await page.waitForSelector(SELECTORS.PASSWORD);
        await page.type(SELECTORS.PASSWORD, this.password + "\n");
        await page.waitForXPath(
            `//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[1]/`
            + `div[1]/h1/a/div`
        );

        await page.close();

        console.log("Successfully logged in");
    }

    async getFollowing(username) {
        const page = await this.openPage();
        const users = {};
        let isFinished = false;

        const parseInstruction = instruction => {
            if (
                instruction.type == "TimelineTerminateTimeline"
                && instruction.direction == "Bottom"
            ) {
                isFinished = true;
                return;
            }

            if (instruction.type != "TimelineAddEntries")
                return;

            instruction.entries.forEach(entry => {
                if (entry.content.itemContent?.itemType != "TimelineUser")
                    return;

                const user = entry.content.itemContent.user_results.result
                    .legacy;

                if (!user)
                    return;

                users[user.screen_name] = {
                    username: user.name,
                    description: user.description,
                    image: user.profile_image_url_https
                };
            });
        }

        return await new Promise(resolve => {
            page.on("response", async res => {
                if (!res.url().includes("/Following"))
                    return;

                const {data} = await res.json();

                data.user.result.timeline.timeline.instructions
                    .forEach(parseInstruction);

                if (isFinished) {
                    await page.close();
                    return resolve(users);
                }

                await page.waitForSelector(
                    `div[role="progressbar"]`,
                    {hidden: true}
                );
                await new Promise(r => setTimeout(r, 100));
                await page.evaluate(
                    async () => {
                        const el = document.scrollingElement;

                        el.scrollTop = el.scrollHeight;
                    }
                );
            });

            page.goto(`https://twitter.com/${username}/following`);
        });

    }
}

module.exports = TwitterModule;

# Graphinator

## Team Members
* [Alex Trefilov](https://alex.trefilov.dev/)
([@volifter](https://github.com/Volifter))

## Tool Description
Graphinator is a network building and visualisation tool, designed to be used
by people without extensive IT knowledge.

*Easy to learn, hard to master* 😎

## Installation
1. Make sure you have `npm` and `Node.js` version `18.3.0` or greater installed.
2. Clone this repository into a local directory and `cd` into it.
3. Rename all configuration files in the `config` directory by removing
`.template` from their name and changing their contents appropriately
(ex: rename `twitter.template.json` -> `twitter.json`, update `username` and
`password` values inside).
4. Install dependencies.
```sh
npm install
```
5. Start the web server.
```sh
npm start
```
6. Open a web browser and navigate to `127.0.0.1:8080`.
7. Have a look at the [user manual](./MANUAL.md), and enjoy scraping!

## Usage
Please refer to the [User manual](./MANUAL.md) for a complete usage guide.

## Additional Information

### Next steps
* Write a developer manual documenting the module API and a guide for adding new
modules.
* Implement more modules.
* Cache the (most) scraped accounts in a database and set up a crontab for
updating it on a regular basis.
* Before deploying at scale, add some form of authentication/captcha for
scraping tasks to avoid denial-of-service attacks.

### Limitations
The followings retrieval functionality of the Twitter module is rather limited
in speed.

This is due to the fact that it performs a live scraping of the followers list
on the Twitter website, which loads batches of ~16 followers, ~300ms each.

This can become especially noticeable when scraping the followings of large
accounts (over 1000 followings), and could benefit from a layer of caching
(see `Next steps`).

### Design motivations
The tool has been written in the form of a browser application because this
allows it to remain simple in usage while being able to perform complex scraping
tasks on the back-end.

Besides, this allows it to be hosted like any other website and used by
investigators all around the world without the need to write a single line of
code, SQL query or terminal command.

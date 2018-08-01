const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const next = require("next");
const Cookies = require("universal-cookie");
const helmet = require("helmet");

const { parseUserAgent } = require("detect-browser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Promise.resolve(airTable.hydrateFromAirtable()).then(data => {

// init i18next with serverside settings
// using i18next-express-middleware
// loaded translations we can bootstrap our routes
app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(helmet());
  // enable middleware for i18next

  // submitting Feedback
  server.post("/submitComment", (req, res) => {
    console.log("Submitting comments");
    airTable.writeFeedback(req.body);
    res.sendStatus(200);
  });

  // use next.js
  server.get("*", (req, res) => {
    // Check if browse is less than IE 11
    const ua = req.headers["user-agent"];
    const browser = parseUserAgent(ua);

    handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:" + port);
  });
});

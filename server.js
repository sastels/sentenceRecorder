const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const next = require("next");
const helmet = require("helmet");
const AWS = require("aws-sdk");
const bluebird = require("bluebird");
// const { parseUserAgent } = require("detect-browser");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// configure the keys for accessing AWS

console.log("AWS id ", process.env.AWS_ACCESS_KEY_ID);
console.log("AWS key", process.env.AWS_SECRET_ACCESS_KEY);

AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

console.log("AWS", AWS.Config);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: "private",
    Body: buffer,
    Bucket: "llf-logdata",
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());
  server.use(helmet());

  const storage = multer.memoryStorage();
  // const storage = multer.diskStorage({
  //   destination: function(req, file, cb) {
  //     cb(null, "/tmp/my-uploads");
  //   },
  //   filename: function(req, file, cb) {
  //     cb(null, file.fieldname + "-" + Date.now());
  //   }
  // });
  const upload = multer({ storage: storage });

  server.post("/submitBlob", upload.single("audio"), async function(
    req,
    res,
    next
  ) {
    const fileName = "sentenceRecorder_" + Date.now();
    // upload file to s3
    try {
      console.log("uploading to aws");
      const data = await uploadFile(
        req.file.buffer,
        fileName,
        typeof req.file.buffer
      );
      return res.status(200).send(data);
    } catch (error) {
      console.log("Error!! ", error);
      return res.status(400).send(error);
    }
  });

  server.get("*", (req, res) => {
    // Check if browse is less than IE 11
    // const ua = req.headers["user-agent"];
    // const browser = parseUserAgent(ua);
    handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:" + port);
  });
});

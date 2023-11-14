let express = require("express");
const fileUpload = require("express-fileupload")
let bodyParser = require("body-parser");
let path = require("path");
let fs = require("fs");
let config = require("./config.json");
const { mongodb } = require("./helper");
const router = require("./v1/route")
let app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload({ parseNested: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1",router);

mongodb.connect();



app.listen(config.server.port, () => {
    console.log("App listening on port : ", config.server.port);
  });
  
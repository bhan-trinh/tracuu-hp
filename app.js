const express = require("express");
const http = require("http");
const app = express();

app.use(express.json());
app.use("/tracuu-hp/", routes)

module.exports = app;
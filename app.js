const express = require("express");
const http = require("http");
const app = express();
const receiptRoutes = require('./routes/receiptRoutes')

app.use(express.json());
app.use("/tracuu-hp/receipt", receiptRoutes)

module.exports = app;
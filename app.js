const express = require("express");
const http = require("http");
const app = express();
const receiptRoutes = require('./routes/receiptRoutes')
const studentRoutes = require('./routes/studentRoutes')

app.use(express.json());
app.use("/tracuu-hp/receipt", receiptRoutes)
app.use("/tracuu-hp/student", studentRoutes)

module.exports = app;
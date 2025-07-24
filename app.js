const express = require("express");
const http = require("http");
const app = express();
const receiptRoutes = require('./routes/receiptRoutes')
const studentRoutes = require('./routes/studentRoutes')
const vnptApiRoutes = require('./routes/vnptApiRoutes');
const { myRequestHeaders, validateRequest } = require("./middlewares/validators");

const domain = '/tracuu-hp'

app.use(express.json());

app.use(myRequestHeaders, validateRequest, async(req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    // check against database
})

app.use(`${domain}/receipt`, receiptRoutes)
app.use(`${domain}/student`, studentRoutes)
app.use(`${domain}/vnptApi`, vnptApiRoutes)

module.exports = app;
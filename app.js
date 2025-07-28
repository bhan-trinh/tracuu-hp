const express = require("express");
const http = require("http");
const app = express();
const receiptRoutes = require('./routes/receipt/receiptRoutes')
const studentRoutes = require('./routes/student/studentRoutes')
const vnptApiRoutes = require('./routes/vnpt/vnptApiRoutes');
const { myRequestHeaders, validateRequest } = require("./middlewares/validators");
const { authenticateRequest } = require("./middlewares/authenticators");
const publicRoutes = require('./routes/public/publicRoutes')

const domain = '/api-hp/v1'

app.use(express.json());

app.use(domain, publicRoutes)

app.use(myRequestHeaders, validateRequest, authenticateRequest)

app.use(`${domain}/receipt`, receiptRoutes)
app.use(`${domain}/student`, studentRoutes)
app.use(`${domain}/vnpt`, vnptApiRoutes)

module.exports = app;
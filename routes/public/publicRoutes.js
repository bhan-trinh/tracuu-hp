// (Receipts) Route logic to routes name 

const express = require("express");
const router = express.Router();
const ROUTE = require('./routes')
const authController = require('../../controllers/authController')

router.post(ROUTE.LOGIN, authController.login)

module.exports = router;
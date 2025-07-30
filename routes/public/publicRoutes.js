// (Receipts) Route logic to routes name 

const express = require("express");
const router = express.Router();
const ROUTE = require('./routes')
const authController = require('../../controllers/user/auth')
const paymentController =require('../../controllers/payment')

router.post(ROUTE.LOGIN, authController.login)
router.post(ROUTE.WEBHOOK, paymentController.webhook)

module.exports = router;
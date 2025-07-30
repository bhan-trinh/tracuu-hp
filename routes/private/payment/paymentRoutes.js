// (Receipts) Route logic to routes name 

const express = require("express");
const router = express.Router();
const paymentController = require("../../../controllers/payment");
const ROUTE = require('./routes') 

router.post(ROUTE.GET_PAYMENT_PARAMS, paymentController.getPaymentParams)
router.post(ROUTE.UPDATE_SUCCESSFUL_PAYMENT, paymentController.notifyPayment)

module.exports = router;
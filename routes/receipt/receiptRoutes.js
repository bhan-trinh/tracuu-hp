// (Receipts) Route logic to routes name 

const express = require("express");
const router = express.Router();
const receiptController = require("../../controllers/receiptController");
const ROUTE = require('./routes') 

router.get(ROUTE.GET_RECEIPT_BY_ID, receiptController.readFullReceiptById)
router.get(ROUTE.GET_RECEIPT_BY_BILL_ID, receiptController.readFullReceiptByBillId)
router.get(ROUTE.GET_RECEIPTS_BY_USER_ID, receiptController.readFullReceiptsByUserId)

module.exports = router;
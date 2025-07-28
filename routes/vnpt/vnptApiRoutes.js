const express = require("express");
const router = express.Router();
const receiptController = require("../../controllers/receiptController");
const ROUTE = require('./routes') 

router.get(ROUTE.LOOK_UP_VNPT, receiptController.lookUpReceiptVNPT);
router.get(ROUTE.LOOK_UP_WRITE_VNPT, receiptController.lookUpWriteReceiptVNPT)

module.exports = router;
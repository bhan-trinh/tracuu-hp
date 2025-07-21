// (Receipts) Route logic to routes name 

const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/lookUpReceipt", receiptController.lookUpReceiptVNPT);
router.get("/:id", receiptController.readReceiptById)

module.exports = router;
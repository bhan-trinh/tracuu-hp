// (Receipts) Route logic to routes name 

const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/:id", receiptController.readFullReceiptById)
router.get("/bill/:billId", receiptController.readFullReceiptByBillId)

module.exports = router;
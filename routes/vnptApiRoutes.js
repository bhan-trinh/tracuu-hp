const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/receiptController");

router.get("/look-up", receiptController.lookUpReceiptVNPT);
router.get("/look-up-write", receiptController.lookUpWriteReceiptVNPT)

module.exports = router;
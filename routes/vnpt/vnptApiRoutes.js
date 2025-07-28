const express = require("express");
const router = express.Router();
const vnptController = require("../../controllers/vnptController");
const ROUTE = require('./routes') 

router.get(ROUTE.LOOK_UP_VNPT, vnptController.lookUpReceiptVNPT);
router.get(ROUTE.LOOK_UP_WRITE_VNPT, vnptController.lookUpWriteReceiptVNPT)

module.exports = router;
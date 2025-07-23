// (Student) Route logic to routes name 

const express = require("express");
const router = express.Router();
const receiptController = require("../controllers/studentController");

router.get("/:id", receiptController.readStudentById)
router.get("/receipt/:receiptId", receiptController.readStudentByReceiptId)

module.exports = router;
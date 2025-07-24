// (Student) Route logic to routes name 

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/:id", studentController.readStudentById)
router.get("/receipt/:receiptId", studentController.readStudentByReceiptId)

module.exports = router;
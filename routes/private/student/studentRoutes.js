// (Student) Route logic to routes name 

const express = require("express");
const router = express.Router();
const studentController = require("../../../controllers/student");
const ROUTE = require('./routes') 

router.get(ROUTE.GET_STUDENT_BY_ID, studentController.readStudentById)
router.get(ROUTE.GET_STUDENT_BY_RECEIPT_ID, studentController.readStudentByReceiptId)

module.exports = router;
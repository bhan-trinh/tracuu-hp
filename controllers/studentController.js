const studentModel = require("../models/studentModel")

// student/readStudent/:id
exports.readStudentById = async (req, res) => {
  const { id } = req.params
  const student = await studentModel.findStudentById(id)
  console.log(student)
  res.json(student)
}

exports.readStudentByReceiptId = async (req, res) => {
  const {receiptId} = req.params
  const student = await studentModel.findStudentByReceiptId(receiptId)
  console.log(student)
  res.json(student)
}

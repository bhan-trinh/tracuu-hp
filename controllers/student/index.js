const studentModel = require("../../models/student");

// student/:id
exports.readStudentById = async (req, res) => {
  const { id } = req.params;
  const student = await studentModel.findStudentById(id);
  res.json(student);
};

// student/receipt/:receiptId
exports.readStudentByReceiptId = async (req, res) => {
  const { receiptId } = req.params;
  const student = await studentModel.findStudentByReceiptId(receiptId);
  res.json(student);
};

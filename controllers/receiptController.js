// (Receipts) Logic for request/response

const receiptModel = require('../models/receiptModel')
const userModel = require('../models/userModel')

// Test route
exports.readReceiptById = async (req, res) => {
  const { id } = req.params
  const receipt = await receiptModel.findReceiptById(id)
  console.log(receipt)
  res.json(receipt)
}

// receipt/:id
exports.readFullReceiptById = async (req, res) => {
  const { id } = req.params
  const user = req.user

  const fullReceipt = await receiptModel.findFullReceiptById(id)
  await userModel.mapReceiptToUser(user.userId, id)
  res.json(fullReceipt)
}

// receipt/bill/:billId
exports.readFullReceiptByBillId = async (req, res) => {
  const { billId } = req.params
  const user = req.user
  // ?
  const receiptId = await receiptModel.findReceiptIdByBillId(billId)
  const fullReceipt = await receiptModel.findFullReceiptById(receiptId)
  await userModel.mapReceiptToUser(user.userId, receiptId)
  res.json(fullReceipt)
}

// receipt/user/getAll
exports.readFullReceiptsByUserId = async (req, res) => {
  const userId = req.user.userId
  console.log(userId)
  const allReceipts = await receiptModel.findFullReceiptsByUserId(userId)
  res.json(allReceipts)
}

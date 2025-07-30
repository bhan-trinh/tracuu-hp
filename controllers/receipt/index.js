// (Receipts) Logic for request/response

const receiptModel = require('../../models/receipt')
const userModel = require('../../models/user')

// Test route
exports.readReceiptById = async (req, res) => {
  const { id } = req.params
  const receipt = await receiptModel.findReceiptById(id)
  res.json(receipt)
}

// receipt/:id
exports.readFullReceiptById = async (req, res) => {
  const { id } = req.params
  const user = req.user

  try {
    const fullReceipt = await receiptModel.findFullReceiptById(id)
  if (fullReceipt)
  {
    await userModel.mapReceiptToUser(user.userId, id)
    res.json(fullReceipt)
  }
  else {
    res.status(404).json({error: "Không tồn tại hoá đơn với mã đã nhập."})
  }
} catch (err) {
    console.log(`Read Full Receipt by ID failed: ${err}`)
  }

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
  const allReceipts = await receiptModel.findFullReceiptsByUserId(userId)
  res.json(allReceipts)
}

exports.readPaidReceiptsByUserId = async (req, res) => {
  const userId = req.user.userId
  const allReceipts = await receiptModel.findPaidReceiptsByUserId(userId)
  res.json(allReceipts)
}


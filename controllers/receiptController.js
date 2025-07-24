// (Receipts) Logic for request/response

const {SHA256} = require('../utils/SHA256')
const {padDate} = require('../utils/padDate')
const receiptModel = require('../models/receiptModel')
const studentModel = require('../models/studentModel')
const billModel = require('../models/billModel')

// Test route
exports.readReceiptById = async (req, res) => {
  const { id } = req.params
  const receipt = await receiptModel.findReceiptById(id)
  console.log(receipt)
  res.json(receipt)
}

// receipt/full/:id
exports.readFullReceiptById = async (req, res) => {
  const { id } = req.params
  const fullReceipt = await receiptModel.findFullReceiptById(id)
  res.json(fullReceipt)
}

// receipt/full/bill/:billId
exports.readFullReceiptByBillId = async (req, res) => {
  const { billId } = req.params
  // ?
  const fullReceipt = await receiptModel.findReceiptByBillId(billId)
  res.json(fullReceipt)
}

// receipt/look-up
exports.lookUpReceiptVNPT = async (req, res) => {
  const resp = await receiptModel.findReceiptVNPT();
  const json = JSON.parse(resp.BILL_DETAIL)
  console.log(json)
  if (resp.RESPONSE_CODE === '00') res.json(json)
    else throw new Error(`Error from VNPT Money API: Response code: ${json.RESPONSE_CODE}`)
};

// receipt/look-up-write
exports.lookUpWriteReceiptVNPT = async (req, res) => {
    const resp = await receiptModel.findReceiptVNPT()
    const receipt = JSON.parse(resp.BILL_DETAIL)
    console.log(receipt)
    await receiptModel.writeFullReceipt(receipt)
    res.send(receipt)
}


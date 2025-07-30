const receiptModel = require('../models/receiptModel')

// vnpt/look-up
exports.lookUpReceiptVNPT = async (req, res) => {
  const resp = await receiptModel.findReceiptVNPT();
  const json = JSON.parse(resp.BILL_DETAIL)
  console.log(json)
  if (resp.RESPONSE_CODE === '00') res.json(json)
    else throw new Error(`Error from VNPT Money API: Response code: ${json.RESPONSE_CODE}`)
};

// vnpt/look-up-write
exports.lookUpWriteReceiptVNPT = async (req, res) => {
    const resp = await receiptModel.findReceiptVNPT()
    const receipt = JSON.parse(resp.BILL_DETAIL)
    console.log(receipt)
    await receiptModel.writeFullReceipt(receipt)
    res.send(receipt)
}
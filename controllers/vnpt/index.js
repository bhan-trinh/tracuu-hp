const vnptModel = require('../../models/vnpt')
const receiptModel = require('../../models/receipt')

// vnpt/look-up
exports.lookUpReceiptVNPT = async (req, res) => {
  const resp = await vnptModel.findReceiptVNPT();
  const json = JSON.parse(resp.BILL_DETAIL)
  console.log(json)
  if (resp.RESPONSE_CODE === '00') res.json(json)
    else throw new Error(`Error from VNPT Money API: Response code: ${json.RESPONSE_CODE}`)
};

// vnpt/look-up-write
exports.lookUpWriteReceiptVNPT = async (req, res) => {
    const resp = await vnptModel.findReceiptVNPT()
    const receipt = JSON.parse(resp.BILL_DETAIL)
    console.log(receipt)
    await receiptModel.writeFullReceipt(receipt)
    res.send(receipt)
}
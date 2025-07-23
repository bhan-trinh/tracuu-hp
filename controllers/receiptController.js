// (Receipts) Logic for request/response

const {SHA256} = require('../utils/SHA256')
const {padDate} = require('../utils/padDate')
const receiptModel = require('../models/receiptModel')
const studentModel = require('../models/studentModel')
const billModel = require('../models/billModel')

exports.readFullReceiptById = async (req, res) => {
  const { id } = req.params
  const receipt = await receiptModel.findReceiptById(id)
  const student = await studentModel.findStudentByReceiptId(id)
  const bills = await billModel.findBillsByReceiptId(id)
  receipt["hoc_sinh_info"] = student
  receipt["thanh_toan"] = bills
  console.log(receipt)
  res.json(receipt)
}

// receipt/readReceipt/:id
exports.readReceiptById = async (req, res) => {
  const { id } = req.params
  const receipt = await receiptModel.findReceiptById(id)
  console.log(receipt)
  res.json(receipt)
}

// receipt/lookUpReceipt
exports.lookUpReceiptVNPT = async (req, res) => {
  // Create transaction time
  const curTime = new Date();
  const datetime = `${curTime.getFullYear()}${padDate(curTime.getMonth() + 1)}${padDate(curTime.getDay())}${padDate(curTime.getHours())}${padDate(curTime.getMinutes())}${padDate(curTime.getSeconds())}`;

  // Create transaction id
  var id = Date.now() + Math.floor(Math.random() * 100);

  // Tape the values together
  var body = {
    ACTION: process.env.ACTION,
    VERSION: process.env.VERSION,
    PARTNER_ID: process.env.PARTNER_ID,
    SERVICE_ID: process.env.SERVICE_ID,
    SERVICE_PROVIDER_ID: process.env.SERVICE_PROVIDER_ID,
    CHANNEL_ID: process.env.CHANNEL_ID,
    PAYMENT_CODE: process.env.PAYMENT_CODE,
    TRANS_DATE_TIME: datetime,
    TRANS_REQUEST_ID: id.toString(),
    ADDITION_INFO: process.env.ADDITION_INFO,
  };
  var tapedValues = [...Object.values(body), [process.env.PRIVATE_KEY]].join(
    "|"
  );

  // Encode them and use as secure code
  var secureCode = SHA256(tapedValues);
  body.SECURE_CODE = secureCode;

  const response = await fetch(
    "https://sandboxpay.vnptmedia.vn/rest/collection/v2.0.0/get_bill",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  if (json.RESPONSE_CODE === '00') res.send(json)
    else throw new Error(`Error from VNPT Money API: Response code: ${json.RESPONSE_CODE}`)
};


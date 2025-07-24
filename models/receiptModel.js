// (Receipts) Handles DB queries
const { SHA256 } = require("../utils/SHA256");
const { padDate } = require("../utils/padDate");
const db = require("../config/db");
const oracledb = require("oracledb");
const studentModel = require('./studentModel')
const billModel = require('./billModel')

exports.findReceiptById = async (id) => {
  const con = await db.getConnection();
  const res = await con.execute(
    `SELECT 
        ID as "id",
        SERVICE as "dich_vu"
        FROM MN02_RECEIPT
    WHERE ID = :id`,
    [id],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  await con.close();

  // Return receipt as a JSON
  return res.rows[0];
};

exports.findFullReceiptById = async (id) => {
  const receipt = await this.findReceiptById(id)
  const student = await studentModel.findStudentByReceiptId(id)
  const bills = await billModel.findBillsByReceiptId(id)
  receipt["hoc_sinh_info"] = student
  receipt["thanh_toan"] = bills

  // Return receipt as a JSON
  return receipt
}

exports.findReceiptByBillId = async (billId) => {
  const con = await db.getConnection();
  const res = await con.execute(
    `SELECT
      RECEIPT_ID as "receiptId"
      FROM MN02_BILL
    WHERE ID = :billId
    `, [billId], {outFormat: oracledb.OUT_FORMAT_OBJECT}
  )
  await con.close()
  console.log(res.rows)
  const receiptId = res.rows[0]['receiptId']

  if (receiptId === undefined || receiptId === null) throw ("Error: Cannot find receipt")
  // Return receipt as a JSON
  return await this.findFullReceiptById(receiptId)

}

exports.writeFullReceipt = async (receipt) => {
  const con = await db.getConnection();
  const student = receipt.hoc_sinh_info;

  // Insert student info
  const query = `
  DECLARE new_student_id NUMBER;
    BEGIN
      INSERT INTO MN02_STUDENT (
          STUDENT_NAME,
          CLASS_NAME,
          SCHOOL_NAME,
          CLASS_ID,
          SCHOOL_ID,
          PROVINCE_ID)
      VALUES (:studentName, :className, :schoolName, :classId, :schoolId, :provinceId)
      RETURNING ID INTO new_student_id;

      INSERT INTO MN02_RECEIPT (
        SERVICE,
        STUDENT_ID
      )
      VALUES (
        :service,
        new_student_id
      )

      RETURNING ID INTO :receiptId;
      COMMIT;
    END;
        `;
  // Insert receipt info
  const res = await con.execute(query, {
    studentName: student.ten_hoc_sinh,
    className: student.ten_lop,
    schoolName: student.ten_truong,
    classId: student.lop_hoc_id,
    schoolId: student.truong_id,
    provinceId: student.tinh_id,
    service: 'VnEdu',
    receiptId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
  });

  const receiptId = res.outBinds.receiptId;

  // Insert bill info
  const bills = receipt.thanh_toan;
  const billQuery = `
    INSERT INTO MN02_BILL (ID,
  AMOUNT,
  DESCRIPTION,
  NAME,
  RECEIPT_ID,
  ALLOW_ONLINE,
  USE_SERVICE_ID,
  SOURCE,
  DEBT_SERVICE_ID) VALUES (:id, :amount, :description, :name, :receiptId, :allowOnl, :useServId, :src, :debtServId)
  `

  const billDetailQuery = `INSERT INTO MN02_BILL_DETAIL(
      BILL_ID,
      NAME,
      AMOUNT,
      CODE,
      BIC)
      VALUES (:billId, :name, :amount, :code, :bic)`

  for (var bill of bills) {
    await con.execute(
      billQuery,
      {
        id: bill.id,
        amount: bill.tong_tien,
        description: bill.noi_dung,
        name: bill.ten_thanh_toan,
        receiptId: receiptId,
        allowOnl: bill.allow_online,
        useServId: bill.dv_su_dung_id,
        src: bill.source,
        debtServId: bill.dv_du_no,
      },
      { autoCommit: true }
    );

    // Insert bill detail info
    for (var billDetail of bill.chi_tiet) {
      await con.execute(
        billDetailQuery,
        {
          billId: bill.id,
          name: billDetail.ten,
          amount: billDetail.tong_tien,
          code: billDetail.code,
          bic: billDetail.code_thu_huong,
        },
        { autoCommit: true }
      );
    }
  }
  await con.close()
};


exports.findReceiptVNPT = async (req, res) => {
  // Create transaction time
  const curTime = new Date();
  const datetime = `${curTime.getFullYear()}${padDate(
    curTime.getMonth() + 1
  )}${padDate(curTime.getDay())}${padDate(curTime.getHours())}${padDate(
    curTime.getMinutes()
  )}${padDate(curTime.getSeconds())}`;

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
  return json
};

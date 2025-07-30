// (Receipts) Handles DB queries
const { SHA256 } = require("../../utils/SHA256");
const { padDate } = require("../../utils/padDate");
const db = require("../../config/db");
const oracledb = require("oracledb");
const studentModel = require("../student");
const billModel = require("../bill");

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
  const receipt = await this.findReceiptById(id);
  if (!receipt) {
    console.log("FindFullReceiptById: No Receipt with that ID found.")
    return
  }
  const student = await studentModel.findStudentByReceiptId(id);
  const bills = await billModel.findBillsByReceiptId(id);
  receipt["hoc_sinh_info"] = student;
  receipt["thanh_toan"] = bills;

  // Return receipt as a JSON
  return receipt;
};

exports.findReceiptIdByBillId = async (billId) => {
  const con = await db.getConnection();
  const res = await con.execute(
    `SELECT
      RECEIPT_ID as "receiptId"
      FROM MN02_BILL
    WHERE ID = :billId
    `,
    [billId],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  await con.close();
  console.log(res.rows);
  const receiptId = res.rows[0]["receiptId"];

  if (receiptId === undefined || receiptId === null)
    throw "Error: Cannot find receipt";
  // Return receipt as a JSON
  return receiptId;
};

exports.findFullReceiptsByUserId = async (userId) => {
  const con = await db.getConnection();
  const allReceiptsId = await con.execute(
    `SELECT RECEIPT_ID AS "receiptId"
    FROM MN02_USER_RECEIPT
    WHERE USER_ID = :userId`,
    [userId],
    { outFormat: oracledb.outFormat }
  );
  await con.close();
  var allReceipts = [];
  for (var receipt of allReceiptsId.rows) {
    var receiptId = receipt[0];
    var receipt = await this.findFullReceiptById(receiptId);
    allReceipts.push(receipt);
  }
  return allReceipts;
};

exports.findPaidReceiptsByUserId = async (userId) => {
  const con = await db.getConnection();
  const res = await con.execute(
    `SELECT 
      MN02_PAID_RECEIPT.ID AS "id",
      SERVICE as "dich_vu",
      DESCRIPTION as "ten_thanh_toan",
      TO_CHAR(PAYMENT_TIME, 'DD/MM/YYYY HH24:MI:SS') as "thoi_gian_giao_dich", 
      AMOUNT as "tong_tien"
      FROM MN02_PAID_RECEIPT
      INNER JOIN MN02_BILL ON MN02_PAID_RECEIPT.ID = MN02_BILL.RECEIPT_ID
      WHERE PAYER_USER_ID = :userId`,
    [userId],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  await con.close();
  const allReceipts = res.rows
  // console.log(`All receipts returned from findPaidReceiptsByUserId with user ID = ${userId}`)
  // console.log(allReceipts)
  return allReceipts;
};


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
    service: "VnEdu",
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
  `;

  const billDetailQuery = `INSERT INTO MN02_BILL_DETAIL(
      BILL_ID,
      NAME,
      AMOUNT,
      CODE,
      BIC)
      VALUES (:billId, :name, :amount, :code, :bic)`;

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
  await con.close();
};


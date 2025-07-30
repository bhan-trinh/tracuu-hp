const db = require("../config/db");
const oracledb = require("oracledb");

exports.findStudentById = async (id) => {
  const con = await db.getConnection();
  const res = await con.execute(
    `SELECT 
        ID AS "id",
        STUDENT_NAME as "ten_hoc_sinh",
        CLASS_NAME as "ten_lop",
        SCHOOL_NAME as "ten_truong",
        CLASS_ID as "lop_hoc_id",
        SCHOOL_ID as "truong_id",
        PROVINCE_ID as "tinh_id"
    FROM MN02_STUDENT WHERE ID = :id`,
    [id],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  await con.close();
  return res.rows[0];
};

exports.findStudentByReceiptId = async (receiptId) => {
  const con = await db.getConnection();
  const res = await con.execute(`SELECT * FROM MN02_RECEIPT WHERE ID = :receiptId`, [
    receiptId,
  ],
    { outFormat: oracledb.OUT_FORMAT_OBJECT });
  await con.close();
  const studentId = res.rows[0]["STUDENT_ID"]
  const student = await this.findStudentById(studentId);
  return student;
};

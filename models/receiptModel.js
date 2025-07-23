// (Receipts) Handles DB queries
const db = require("../config/db");
const oracledb = require("oracledb");

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
  return res.rows[0];
};


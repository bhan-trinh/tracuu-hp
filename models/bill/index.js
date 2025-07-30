const db = require('../config/db')
const oracledb = require('oracledb')

exports.findBillById = async (id) => {
    const con = await db.getConnection()
    const res = await con.execute(
        `SELECT 
            ID as "id",
            AMOUNT as "tong_tien",
            DESCRIPTION as "noi_dung",
            NAME as "ten_thanh_toan"
        FROM MN02_BILL WHERE ID = :id
        `, [id], {outFormat: oracledb.OUT_FORMAT_OBJECT}
    )
    await con.close()
    return res.row[0]
}

exports.findBillsByReceiptId = async (receiptId) => {
      const con = await db.getConnection();
      const res = await con.execute(
        `SELECT 
            ID as "id",
            AMOUNT as "tong_tien",
            DESCRIPTION as "noi_dung",
            NAME as "ten_thanh_toan"
        FROM MN02_BILL WHERE RECEIPT_ID = :id
        `, [receiptId], {outFormat: oracledb.OUT_FORMAT_OBJECT}
    )
    await con.close()
    for (var bill of res.rows){
        const billDetails = await this.findBillDetailsbyBillId(bill['id'])
        bill['chi_tiet'] = billDetails
    }
    return res.rows
}

exports.findBillDetailsbyBillId = async (billId) => {
    const con = await db.getConnection()
    const res = await con.execute(
        `SELECT
            ID as "id",
            NAME as "ten",
            AMOUNT as "tong_tien",
            CODE as "code",
            BIC as "code_thu_huong"
            FROM MN02_BILL_DETAIL
        WHERE BILL_ID = :id
        `, [billId], {outFormat: oracledb.OUT_FORMAT_OBJECT}
    )
    await con.close()
    return res.rows
}
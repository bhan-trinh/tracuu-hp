// (Receipts) Handles DB queries 
const db = require('../config/db')

exports.findReceiptById = async (id) => {
    const con = await db.getConnection();
    const res = await con.execute(
        `SELECT * FROM MN02_RECEIPT` // WHERE ID = :id`, [id]
    )
    await con.close()
    console.log(`Rows returned: ${res.rows}`)
    return res.rows
}
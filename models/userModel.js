const db = require('../config/db')
const oracledb = require('oracledb')
const {randomBytes} = require('crypto')

exports.mapReceiptToUser = async (userId, receiptId) => {
    const con = await db.getConnection()
    const query = 
        `INSERT INTO MN02_USER_RECEIPT (USER_ID, RECEIPT_ID)
        VALUES (:userId, :receiptId)`
    await con.execute(query, [userId, receiptId], {autoCommit: true})

    const res = await con.execute(`
        SELECT USER_ID, RECEIPT_ID FROM MN02_USER_RECEIPT`, 
        [], {outFormat: oracledb.OUT_FORMAT_OBJECT})
    
    await con.close()
    return res.rows[0]
}

exports.writeUser = async (id) => {
    // create apikey
    var token = crypto.randomBytes(32).toString('hex')

    const con = await db.getConnection()
    const query = 
        `INSERT INTO MN02_USER ()
        VALUES ()`
    await con.execute(query, [], {autoCommit: true})

    const res = await con.execute(`
        SELECT * FROM MN02_USER_RECEIPT`, 
        [], {outFormat: oracledb.OUT_FORMAT_OBJECT})
    
    await con.close()
    return res.rows[0]
}
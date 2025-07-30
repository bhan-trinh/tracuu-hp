const db = require("../../config/db");
const oracledb = require("oracledb");
const { randomBytes, hash } = require("crypto");
const { SHA256 } = require("../../utils/SHA256");
const { hashPassWord, checkPassword } = require("../../utils/auth");

exports.mapReceiptToUser = async (userId, receiptId) => {
  const con = await db.getConnection();
  try {const query = `INSERT INTO MN02_USER_RECEIPT (USER_ID, RECEIPT_ID)
        VALUES (:userId, :receiptId)`;
  await con.execute(query, [userId, receiptId], { autoCommit: true });

  const res = await con.execute(
    `
        SELECT USER_ID, RECEIPT_ID FROM MN02_USER_RECEIPT`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );} catch (err) {
    console.log(`Map Receipt to User failed: ${err}`)
    return;
  }

  await con.close();
  return res.rows[0];
};

exports.findUserId = async (username) => {
    const con = await db.getConnection();
    const res = await con.execute(
    `SELECT ID as "userId" FROM MN02_USER WHERE USER_NAME = :username`,
    [username],
    {outFormat: oracledb.OUT_FORMAT_OBJECT}
  ) 
    const userId = res.rows[0]['userId']
    await con.close()
    return userId
};

exports.checkUser = async (username) => {
  const con = await db.getConnection()
  const res = await con.execute(
    `SELECT USER_NAME as "username" FROM MN02_USER WHERE USER_NAME = :username`,
    [username],
    {outFormat: oracledb.OUT_FORMAT_OBJECT}
  ) 
  await con.close()
  
  if (res.rows.length != 0) {
    return true
  }
  return false
}

exports.checkPassword = async (username, password) => {
  const con = await db.getConnection()
  const res = await con.execute(
    `SELECT PASSWORD AS "password" FROM MN02_USER WHERE USER_NAME = :username`,
    [username],
    {outFormat: oracledb.OUT_FORMAT_OBJECT}
  ) 
  await con.close()
  const hashedPassword = res.rows[0]['password']

  return await checkPassword(password, hashedPassword)
};


exports.createUser = async (username, password) => {
  const hashedPassword = await hashPassWord(password);
  const con = await db.getConnection();
    const query = `INSERT INTO MN02_USER (USER_NAME, PASSWORD, CREATE_DATE, UPDATE_DATE)
        VALUES (:username, :password, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    await con.execute(
      query,
      {
        username: username,
        password: hashedPassword,
      },
      { autoCommit: true }
    );
    await con.close()
};

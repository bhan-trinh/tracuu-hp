// Connect to Oracle DB

const oracledb = require("oracledb")
// oracledb.initOracleClient();

const pool = oracledb.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT,
    poolMin: 2,
    poolMax: 10, 
    poolIncrement: 1,
})

exports.getConnection = async () => {
    if (!oracledb.getPool()) await pool;
    const db = await oracledb.getConnection();
    const dbInfo = await db.execute(
        `SELECT
            * FROM MN02_RECEIPT`)
    console.log(`DB INFO: ${dbInfo.rows}`)
    return db
}
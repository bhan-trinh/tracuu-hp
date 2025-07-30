const db = require("../../config/db");

exports.moveToPaidReceipt = async (receiptId, userId) => {
  const con = await db.getConnection();
  
  try {
    // Copy receipt to new paid receipt
    await con.execute(
      `
    INSERT INTO MN02_PAID_RECEIPT (ID, SERVICE, STUDENT_ID)
    SELECT ID, SERVICE, STUDENT_ID
    FROM MN02_RECEIPT
    WHERE ID = :id`,
      [receiptId],
      { autoCommit: true }
    );
    
    // Add payer detail
    await con.execute(
      `
    UPDATE MN02_PAID_RECEIPT
    SET PAYMENT_TIME = CURRENT_TIMESTAMP,
    PAYER_USER_ID = :userId
    WHERE ID = :id`,
      [userId, receiptId],
      { autoCommit: true }
    );

    // Delete user-receipt data
    await con.execute(
        `DELETE FROM MN02_USER_RECEIPT WHERE RECEIPT_ID = :receiptId`,
        [receiptId],
        { autoCommit: true}
    )

    // Delete receipt data
    await con.execute(
      `
        DELETE FROM MN02_RECEIPT WHERE ID = :id
        `,
      [receiptId],
      { autoCommit: true }
    );

    
  } catch (err) {
    await con.close();
    console.log (`Move paid to receipt failed: ${err}`);
  }
  await con.close();
};

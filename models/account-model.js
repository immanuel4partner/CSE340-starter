const pool = require("../database")

/* *****************************
 * Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `INSERT INTO account
      (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING account_id, account_firstname, account_lastname, account_email, account_type`

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ])

    return result.rows[0]
  } catch (error) {
    console.error("DB Register Error:", error)
    return null
  }
}

/* *****************************
 * Get account by email
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT 
        account_id, 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_type, 
        account_password 
      FROM account 
      WHERE account_email = $1
    `
    const result = await pool.query(sql, [account_email])

    return result.rows[0]
  } catch (error) {
    console.error("DB Email Lookup Error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  getAccountByEmail,
}
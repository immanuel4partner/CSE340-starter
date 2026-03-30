const utilities = require("../utilities")


/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  return res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    pageClass: "login",
  })
}

module.exports = { buildLogin };
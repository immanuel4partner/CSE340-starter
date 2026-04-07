const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")


// Route for /account (redirects to login)
router.get("/", (req, res) => {
  return res.redirect("/account/login");
});

// ==============================
// GET Routes (Display Views)
// ==============================

// Route to deliver the login page
// When the user visits /account/login in the browser,
// this calls the buildLogin controller to render the login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Route to deliver the registration page
// When the user visits /account/register,
// this calls the buildRegister controller to render the register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)


// ==============================
// POST Routes (Process Form Data)
// ==============================

// Route to handle registration form submission
// When the user submits the registration form (method="post"),
// data is sent to /account/register and processed by registerAccount
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)

// Route to handle login form submission
// When the user submits the login form (method="post"),
// data is sent to /account/login and processed by loginAccount
router.post(
  "/login",
  utilities.handleErrors(accountController.loginAccount)
)

module.exports = router
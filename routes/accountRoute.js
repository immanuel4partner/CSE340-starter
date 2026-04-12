const express = require("express")
const router = express.Router()
const regValidate = require("../utilities/account-validation")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// ==============================
// DEFAULT ACCOUNT ROUTE
// ==============================
// After login, user comes here
router.get(
  "/",
  utilities.handleErrors(accountController.buildAccountManagement)
)


// ==============================
// GET Routes (Display Views)
// ==============================

// Login page
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Register page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)


// ==============================
// POST Routes (Process Form Data)
// ==============================

// Handle registration
router.post(
  "/register",
  regValidate.registerRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
// Handle login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router
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

// ✅ LOGOUT (FIXED)
router.get(
  "/logout",
  accountController.logoutAccount
)

// ✅ ACCOUNT UPDATE VIEW
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateView)
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

// ✅ UPDATE ACCOUNT INFO
router.post(
  "/update",
  utilities.handleErrors(accountController.updateAccount)
)

// ✅ UPDATE PASSWORD
router.post(
  "/update-password",
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
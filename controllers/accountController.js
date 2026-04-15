const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 **************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    account_email: "",
    errors: [],
    pageClass: "login-page",
  })
}

/* ****************************************
 *  Deliver registration view
 **************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
    errors: [],
  })
}

/* ****************************************
 *  Deliver account management view
 **************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    errors: null,
  })
}

/* ****************************************
 *  ✅ FIXED: Deliver update account view
 **************************************** */
async function buildUpdateView(req, res, next) {
  try {
    const nav = await utilities.getNav()

    // ✅ GET ID FROM URL
    const account_id = req.params.account_id

    // ✅ GET DATA FROM DATABASE (NOT JUST JWT)
    const accountData = await accountModel.getAccountById(account_id)

    if (!accountData) {
      req.flash("notice", "Account not found.")
      return res.redirect("/account/")
    }

    res.render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      errors: [],
      flash: {
        notice: req.flash("notice"),
        error: req.flash("error"),
      }
    })

  } catch (error) {
    console.error("buildUpdateView error:", error)
    next(error)
  }
}

/* ****************************************
 *  Process Registration
 **************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  try {
    const existingAccount = await accountModel.getAccountByEmail(account_email)

    if (existingAccount) {
      return res.render("account/register", {
        title: "Register",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        errors: ["Email already exists."],
      })
    }

    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult) {
      req.flash("notice", `Welcome ${account_firstname}, please login.`)
      return res.render("account/login", {
        title: "Login",
        nav,
        account_email,
        errors: [],
        pageClass: "login-page",
      })
    }

    throw new Error("Registration failed")
  } catch (error) {
    console.error(error)
    return res.render("account/register", {
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: ["Registration failed."],
    })
  }
}

/* ****************************************
 *  Process Login
 **************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Invalid credentials")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [],
        account_email,
        pageClass: "login-page",
      })
    }

    const isMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!isMatch) {
      req.flash("notice", "Invalid credentials")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: [],
        account_email,
        pageClass: "login-page",
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(
      accountData,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 1000,
    })

    req.flash("notice", "Login successful!")
    return res.redirect("/account/")
  } catch (error) {
    console.error(error)

    req.flash("notice", "Login failed.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: [],
      account_email,
      pageClass: "login-page",
    })
  }
}

/* ****************************************
 *  Update Account Info
 **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  try {
    const result = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (result) {
      req.flash("notice", "Account updated successfully.")
      return res.redirect("/account/")
    }

    throw new Error("Update failed")
  } catch (error) {
    console.error(error)

    req.flash("notice", "Update failed.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      accountData: res.locals.accountData,
      errors: ["Update failed."],
    })
  }
}

/* ****************************************
 *  Update Password
 **************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (result) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    }

    throw new Error("Password update failed")
  } catch (error) {
    console.error(error)

    req.flash("notice", "Password update failed.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      accountData: res.locals.accountData,
      errors: ["Password update failed."],
    })
  }
}

/* ****************************************
 *  Logout
 **************************************** */
function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.session.destroy(() => {
    res.redirect("/")
  })
}

/* ****************************************
 *  EXPORTS
 **************************************** */
module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  buildUpdateView,
  registerAccount,
  accountLogin,
  updateAccount,
  updatePassword,
  logoutAccount,
}
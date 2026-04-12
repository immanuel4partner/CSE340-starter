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
    errors: null,
  })
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
 *  Process Login (JWT + Cookie)
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

    // ✅ Remove password before creating token
    delete accountData.account_password

    // ✅ SAFER JWT PAYLOAD (important improvement)
    const payload = {
      account_id: accountData.account_id,
      account_email: accountData.account_email,
      account_type: accountData.account_type,
    }

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    )

    // ✅ Set cookie
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 1000,
    })

    req.flash("notice", "Login successful!")

    return res.redirect("/account/")
  } catch (error) {
    console.error(error)

    req.flash("notice", "Login failed. Please try again.")

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
 *  EXPORTS
 **************************************** */
module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  registerAccount,
  accountLogin,
}
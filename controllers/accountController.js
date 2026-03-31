const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    account_email: "",
    errors: null,
  })
}


/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
    errors: null,
  })
}


/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  try {
    // =========================
    // Validate input
    // =========================
    if (
      !account_firstname ||
      !account_lastname ||
      !account_email ||
      !account_password
    ) {
      req.flash("error", "All fields are required.")
      return res.render("account/register", {
        title: "Register",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        errors: null,
      })
    }

    // =========================
    // Check if email exists
    // =========================
    const existingAccount = await accountModel.getAccountByEmail(account_email)
    if (existingAccount) {
      req.flash("error", "Email already exists.")
      return res.render("account/register", {
        title: "Register",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        errors: null,
      })
    }

    // =========================
    // Hash password
    // =========================
    const hashedPassword = await bcrypt.hash(account_password, 10)

    // =========================
    // Save to database
    // =========================
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    // =========================
    // Success
    // =========================
    if (regResult) {
      req.flash(
        "success",
        `Congratulations, ${account_firstname}, you're registered! Please log in.`
      )

      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        account_email,
        errors: null,
      })
    }

    throw new Error("Registration failed")

  } catch (error) {
    console.error("REGISTER ERROR:", error.message)

    req.flash("error", "Registration failed. Please try again.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process Login
 * *************************************** */
async function loginAccount(req, res) {
  const nav = await utilities.getNav()

  const { account_email, account_password } = req.body

  try {
    // =========================
    // Find account
    // =========================
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("error", "Invalid email or password.")
      return res.render("account/login", {
        title: "Login",
        nav,
        account_email,
        errors: null,
      })
    }

    // =========================
    // Compare password
    // =========================
    const isMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!isMatch) {
      req.flash("error", "Invalid email or password.")
      return res.render("account/login", {
        title: "Login",
        nav,
        account_email,
        errors: null,
      })
    }

    // =========================
    // Success
    // =========================
    req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
    return res.redirect("/account/login")

  } catch (error) {
    console.error("LOGIN ERROR:", error.message)

    req.flash("error", "Login failed. Please try again.")
    return res.render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: null,
    })
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
}
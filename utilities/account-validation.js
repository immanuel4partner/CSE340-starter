const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

// ==============================
// LOGIN RULES
// ==============================
exports.loginRules = () => [
  body("account_email").isEmail().withMessage("Valid email is required"),
  body("account_password").notEmpty().withMessage("Password is required"),
];

// ==============================
// REGISTER RULES
// ==============================
exports.registerRules = () => [
  body("account_firstname").notEmpty().withMessage("First name is required"),
  body("account_lastname").notEmpty().withMessage("Last name is required"),
  body("account_email").isEmail().withMessage("Valid email is required"),
  body("account_password")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters"),
];

// ==============================
// CHECK LOGIN DATA
// ==============================
exports.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array().map(e => e.msg),
      account_email: req.body.account_email,
      pageClass: "login-page",
    });
  }

  next();
};

// ==============================
// CHECK REGISTER DATA
// ==============================
exports.checkRegData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();

    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors: errors.array().map(e => e.msg),
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    });
  }

  next();
};
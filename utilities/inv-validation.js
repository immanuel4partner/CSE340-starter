const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

const validate = {};

/* ***************************
 * Classification rules
 * *************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      // 🔥 FIX: no spaces or special characters
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters."),
  ];
};

/* ***************************
 * Check classification data
 * *************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    // 🔥 ADD FLASH
    req.flash("error", errors.array().map(e => e.msg));

    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name,
    });
  }
  next();
};

/* ***************************
 * Inventory rules (for add & update)
 * *************************** */
validate.inventoryRules = () => {
  return [
    body("inv_id").optional().isInt().withMessage("Invalid inventory ID."),

    body("classification_id")
      .notEmpty().withMessage("Please choose a classification.")
      .isInt().withMessage("Classification must be a valid ID."),

    // 🔥 FIX: removed .escape()
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Make is required."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Model is required."),

    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year must be a valid 4-digit year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("inv_price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a valid number greater than 0."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
  ];
};

/* ***************************
 * Check ADD inventory data
 * *************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    // 🔥 FIX: keep dropdown selected
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );

    // 🔥 ADD FLASH
    req.flash("error", errors.array().map(e => e.msg));

    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: errors.array(),

      // 🔥 CLEAN sticky form
      ...req.body,
    });
  }
  next();
};

/* ***************************
 * Check UPDATE inventory data
 * *************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );

    // 🔥 ADD FLASH
    req.flash("error", errors.array().map(e => e.msg));

    return res.render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect,
      errors: errors.array(),
      ...req.body,
    });
  }
  next();
};

module.exports = validate;
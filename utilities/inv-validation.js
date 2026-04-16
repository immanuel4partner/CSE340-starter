const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

const validate = {};

/* =========================
   CLASSIFICATION RULES
========================= */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name must not contain spaces or special characters."
      ),
  ];
};

/* =========================
   CLASSIFICATION CHECK
========================= */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    return res.status(400).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    });
  }

  next();
};

/* =========================
   INVENTORY RULES
========================= */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification.")
      .isInt(),

    body("inv_make").trim().notEmpty().withMessage("Make is required."),

    body("inv_model").trim().notEmpty().withMessage("Model is required."),

    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year must be valid."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image").trim().notEmpty().withMessage("Image is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail is required."),

    body("inv_price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

    body("inv_color").trim().notEmpty().withMessage("Color is required."),
  ];
};

/* =========================
   INVENTORY CHECK (ADD)
========================= */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );

    return res.status(400).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: errors.array(),

      /* sticky form */
      ...req.body,
    });
  }

  next();
};

/* =========================
   UPDATE VALIDATION CHECK
========================= */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();

    const classificationSelect = await utilities.buildClassificationList(
      req.body.classification_id
    );

    return res.status(400).render("inventory/edit-inventory", {
      title: `Edit ${req.body.inv_make} ${req.body.inv_model}`,
      nav,
      classificationSelect,
      errors: errors.array(),

      /* REQUIRED for edit page */
      inv_id: req.body.inv_id,

      /* sticky form */
      ...req.body,
    });
  }

  next();
};

module.exports = validate;
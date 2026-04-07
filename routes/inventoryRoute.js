const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inv-validation");

/* ===== CLASSIFICATION ROUTE ===== */
router.get(
  "/type/:classification_id", // corrected param name
  utilities.handleErrors(invController.buildByClassificationId)
);

/* ===== VEHICLE DETAIL ROUTE ===== */
router.get(
  "/detail/:inv_id", // corrected param name
  utilities.handleErrors(invController.buildDetailView)
);

/* ===== MANAGEMENT VIEW ===== */
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

/* ===== ADD CLASSIFICATION VIEW ===== */
router.get(
  "/add-classification",
  //utilities.checkLogin,
  //utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

/* ===== PROCESS CLASSIFICATION ===== */
router.post(
  "/add-classification",
  //utilities.checkLogin,
  //utilities.checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

/* ===== ADD INVENTORY VIEW ===== */
router.get(
  "/add-inventory",
  //utilities.checkLogin,
  //utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

/* ===== PROCESS INVENTORY ===== */
router.post(
  "/add-inventory",
  //utilities.checkLogin,
  //utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

/* ===== TRIGGER ERROR ===== */
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

module.exports = router;
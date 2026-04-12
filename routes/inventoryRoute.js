const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inv-validation");

/* ===== MANAGEMENT VIEW ===== */
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
);

/* ===== GET INVENTORY JSON (AJAX - REQUIRED) ===== */
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

/* ===== CLASSIFICATION VIEW ===== */
router.get(
  "/type/:classification_id",
  utilities.handleErrors(invController.buildByClassificationId)
);

/* ===== VEHICLE DETAIL VIEW ===== */
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
);

/* ======================================================
   🚨 DELETE ROUTES
   ====================================================== */

/* ===== DELETE CONFIRMATION PAGE ===== */
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteConfirm)
);

/* ===== PROCESS DELETE ===== */
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventoryItem)
);

/* ======================================================
   ✏️ EDIT / UPDATE ROUTES (FIXED)
   ====================================================== */

/* ===== EDIT VIEW ===== */
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventory)
);

/* ===== PROCESS UPDATE (FIXED ROUTE + VALIDATION) ===== */
router.post(
  "/update/",
  invValidate.inventoryRules(),        // same rules as add
  invValidate.checkUpdateData,         // your NEW middleware
  utilities.handleErrors(invController.updateInventory)
);

/* ======================================================
   ➕ ADD ROUTES
   ====================================================== */

/* ===== ADD CLASSIFICATION VIEW ===== */
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

/* ===== PROCESS ADD CLASSIFICATION ===== */
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

/* ===== ADD INVENTORY VIEW ===== */
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

/* ===== PROCESS ADD INVENTORY ===== */
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

/* ===== TRIGGER ERROR (TESTING) ===== */
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

module.exports = router;
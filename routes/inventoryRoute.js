const express = require("express");
const router = express.Router();

const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inv-validation");

/* =========================
   MANAGEMENT VIEW (PROTECTED)
========================= */
router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);

/* =========================
   CLASSIFICATION VIEW (PUBLIC)
========================= */
router.get(
  "/type/:classification_id",
  utilities.handleErrors(invController.buildByClassificationId)
);

/* =========================
   AJAX INVENTORY (PUBLIC)
========================= */
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

/* =========================
   DETAIL VIEW (PUBLIC)
========================= */
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetailView)
);

/* =========================
   DELETE (PROTECTED)
========================= */
router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirm)
);

router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
);

/* =========================
   EDIT + UPDATE (PROTECTED)
========================= */
router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

/* =========================
   ADD INVENTORY (PROTECTED)
========================= */
router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

/* =========================
   ADD CLASSIFICATION (PROTECTED)
========================= */
router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

/* =========================
   ERROR TEST (PUBLIC)
========================= */
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

module.exports = router;
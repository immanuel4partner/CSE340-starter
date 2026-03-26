const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

/* ===== CLASSIFICATION ROUTE ===== */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

/* ===== VEHICLE DETAIL ROUTE ===== */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildDetailView)
);

/* ===== TRIGGER ERROR ROUTE ===== */
router.get(
  "/trigger-error",
  utilities.handleErrors(invController.triggerError)
);

module.exports = router;
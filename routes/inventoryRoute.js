const express = require("express");
const router = express.Router();
const invCont = require("../controllers/invController");
const utilities = require("../utilities");

// classification view
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId));

// vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invCont.buildDetailView));

module.exports = router;
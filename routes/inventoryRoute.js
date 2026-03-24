const express = require("express");
const router = express.Router();
const invCont = require("../controllers/invController");

// Route: /inv/type/:classificationId
router.get("/type/:classificationId", invCont.buildByClassificationId);

module.exports = router;
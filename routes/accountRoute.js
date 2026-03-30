const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

// Deliver login view
// Unit 4 Deliver ogin View Activity

router.get("/login", utilities.handleErrors(accountController.buildLogin))// Show main account page (can be login or a dashboard)
router.get("/", (req, res) => {
  // Option 1: Show login page by default
  res.render("account/login", { title: "Account Login" });

});



module.exports = router

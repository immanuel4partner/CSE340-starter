const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const reviewController = require("../controllers/reviewController")

// =======================
// Add review form
// =======================
router.get(
  "/add/:invId",
  utilities.handleErrors(reviewController.buildAddReview)
)

// =======================
// Submit new review
// =======================
router.post(
  "/add",
  utilities.handleErrors(reviewController.addReview)
)

// =======================
// Edit review form
// =======================
router.get(
  "/edit/:reviewId",
  utilities.handleErrors(reviewController.buildEditReview)
)

// =======================
// Update review
// =======================
router.post(
  "/edit",
  utilities.handleErrors(reviewController.updateReview)
)

// =======================
// Delete review
// =======================
router.get(
  "/delete/:reviewId",
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router
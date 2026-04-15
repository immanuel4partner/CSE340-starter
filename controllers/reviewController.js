const reviewModel = require("../models/review-model")
const utilities = require("../utilities")

const reviewController = {}

/* ***************************
 * Build Add Review View
 *************************** */
reviewController.buildAddReview = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()

    // 🔒 must be logged in
    if (!res.locals.loggedin || !res.locals.accountData) {
      req.flash("notice", "Please log in to leave a review.")
      return res.redirect("/account/login")
    }

    // FIX: support BOTH /add/:invId and /add?invId=
    const invId = parseInt(req.params.invId || req.query.invId)

    if (!invId) {
      req.flash("error", "Invalid vehicle selected for review.")
      return res.redirect("/inv/")
    }

    return res.render("reviews/add-review", {
      title: "Leave a Review",
      nav,
      invId,
      errors: null,
    })

  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Process Review Submission
 *************************** */
reviewController.addReview = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.body.inv_id)
    const rating = parseInt(req.body.rating)
    const review_text = req.body.review_text

    if (!res.locals.accountData) {
      req.flash("notice", "Please log in first.")
      return res.redirect("/account/login")
    }

    // FIX: safer validation
    if (!inv_id || !rating || !review_text || review_text.trim() === "") {
      req.flash("error", "All review fields are required.")
      return res.redirect("back")
    }

    const account_id = res.locals.accountData.account_id

    await reviewModel.addReview(inv_id, account_id, rating, review_text)

    req.flash("notice", "Review submitted successfully.")
    return res.redirect(`/inv/detail/${inv_id}`)

  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Delete Review
 *************************** */
reviewController.deleteReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.reviewId)

    if (!reviewId) {
      req.flash("error", "Invalid review.")
      return res.redirect("/")
    }

    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      req.flash("error", "Review not found.")
      return res.redirect("/")
    }

    if (!res.locals.accountData) {
      req.flash("error", "You must be logged in.")
      return res.redirect("/account/login")
    }

    const account_id = res.locals.accountData.account_id
    const account_type = res.locals.accountData.account_type

    if (review.account_id !== account_id && account_type !== "Admin") {
      req.flash("error", "Unauthorized action.")
      return res.redirect("/")
    }

    await reviewModel.deleteReview(reviewId)

    req.flash("notice", "Review deleted successfully.")
    return res.redirect(`/inv/detail/${review.inv_id}`)

  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Build Edit Review View
 *************************** */
reviewController.buildEditReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.reviewId)
    const nav = await utilities.getNav()

    if (!reviewId) {
      req.flash("error", "Invalid review.")
      return res.redirect("/")
    }

    const review = await reviewModel.getReviewById(reviewId)

    if (!review) {
      req.flash("error", "Review not found.")
      return res.redirect("/")
    }

    return res.render("reviews/edit-review", {
      title: "Edit Review",
      nav,
      review,
      errors: null,
    })

  } catch (err) {
    next(err)
  }
}

/* ***************************
 * Process Update Review
 *************************** */
reviewController.updateReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.body.review_id)
    const rating = parseInt(req.body.rating)
    const review_text = req.body.review_text

    if (!reviewId || !rating || !review_text || review_text.trim() === "") {
      req.flash("error", "All fields are required.")
      return res.redirect("back")
    }

    const updated = await reviewModel.updateReview(
      reviewId,
      rating,
      review_text
    )

    if (!updated) {
      req.flash("error", "Update failed.")
      return res.redirect("/")
    }

    req.flash("notice", "Review updated successfully.")
    return res.redirect(`/inv/detail/${updated.inv_id}`)

  } catch (err) {
    next(err)
  }
}

module.exports = reviewController
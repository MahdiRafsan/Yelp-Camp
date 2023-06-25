const express = require("express");
const router = express.Router({ mergeParams: true });

const isAuthorized = require("../middlewares/authMiddleware");
const { isReviewOwner } = require("../middlewares/checkPermissions");
const checkMultipleReviews = require("../middlewares/checkMultipleReviews");
const {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

// private
// only accessible to admin
// router.get('/', getAllReviews)

// private
// accessible to all users
router.get("/", isAuthorized, getReviews);
router.get("/:reviewId", isAuthorized, getReview);

// private
router.post("/", isAuthorized, checkMultipleReviews, createReview);

// private
// only accessible to admin and review author
router.patch("/:reviewId", isAuthorized, isReviewOwner, updateReview);
router.delete("/:reviewId", isAuthorized, isReviewOwner, deleteReview);


module.exports = router;

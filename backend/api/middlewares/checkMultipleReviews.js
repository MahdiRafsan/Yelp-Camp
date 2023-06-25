const { UnauthenticatedError } = require("../errors");
const Review = require("../models/ReviewModel");
const checkMultipleReviews = async (req, res, next) => {
  try {
    const existingReview = await Review.findOne({
      author: req.user._id,
      campground: req.params.campgroundId,
    });

    if (existingReview) {
      throw new UnauthenticatedError(
        "You already created a review for this campground!"
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkMultipleReviews;

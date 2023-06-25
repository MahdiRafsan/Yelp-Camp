const { UnauthenticatedError, NotFoundError } = require("../errors");
const Campground = require("../models/CampgroundModel");
const Review = require("../models/ReviewModel");

const isOwner = (req, res, next) => {
  try {
    const isAdmin = req?.user?.role === "admin";
    const isAuthor = req.user._id.toString() === req?.params?.userId;
    
    // admin can not delete any user account
    if ((isAdmin && req.method !== "DELETE") || isAuthor) return next();
    else {
      throw new UnauthenticatedError(
        "You do not have permission to access that resource!"
      );
    }
  } catch (err) {
    next(err);
  }
};

const isCampgroundOwner = async (req, res, next) => {
  try {
    const isAdmin = req?.user?.role === "admin";
    const { campgroundId } = req.params;
    const campground = await Campground.findById(campgroundId);
    if (!campground) {
      throw new NotFoundError("Campground not found!");
    }
    const isCampgroundAuthor = campground.author.equals(req.user._id);
    if (isAdmin || isCampgroundAuthor) return next();
    else {
      throw new UnauthenticatedError(
        "You do not have permission to access that resource!"
      );
    }
  } catch (err) {
    next(err);
  }
};

const isReviewOwner = async (req, res, next) => {
  try {
    const isAdmin = req?.user?.role === "admin";
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError("Review not found!");
    }
    const isReviewAuthor = review.author.equals(req.user._id);

    // find campground owner from the review
    // campground owner can only delete the review but not edit them
    const campground = await Campground.findById(review.campground);
    const isCampgroundOwner = campground.author.equals(req.user._id);
    if (
      isAdmin ||
      isReviewAuthor ||
      (isCampgroundOwner && req.method === "DELETE")
    )
      return next();
    else {
      throw new UnauthenticatedError(
        "You do not have permission to access that resource!"
      );
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { isOwner, isCampgroundOwner, isReviewOwner };

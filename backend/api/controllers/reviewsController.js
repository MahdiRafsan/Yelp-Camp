const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const Campground = require("../models/CampgroundModel");
const Review = require("../models/ReviewModel");
const catchAsync = require("../utils/catchAsync");
const paginationAndFilter = require("../utils/paginationAndFilter");

// create review
const createReview = catchAsync(async (req, res, next) => {
  const { rating, description } = req.body;
  const campground = await Campground.findById(req.params.campgroundId);
  const review = await Review.create({
    rating,
    description,
    campground: req.params.campgroundId,
    author: req.user._id,
  });

  campground.reviews.push(review);
  await campground.save();

  if (review) {
    res.status(StatusCodes.CREATED).json({
      message: "New review added successfully!",
      review,
    });
  }
});

// get a review by id
const getReview = catchAsync(async (req, res, next) => {
  const { campgroundId, reviewId } = req.params;
  const review = await Review.findOne({
    _id: reviewId,
    campground: campgroundId,
  });
  if (!review) {
    throw new NotFoundError("Review not found!");
  }
  res.status(StatusCodes.OK).json({ review });
});

// get all reviews on a campground
const getReviews = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;
  const paginationOptions = { page, limit };
  const queryOptions = { campground: req.params.campgroundId };
  const { data, totalPages, currentPage, totalDocs } =
    await paginationAndFilter(Review, paginationOptions, queryOptions);
  res
    .status(StatusCodes.OK)
    .json({ reviews: data, totalPages, currentPage, totalDocs });
});

// update review
const updateReview = catchAsync(async (req, res, next) => {
  const { campgroundId, reviewId } = req.params;
  const { description, rating } = req.body;
  const updatedReview = await Review.findOneAndUpdate(
    { _id: reviewId, campground: campgroundId },
    { description, rating },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({
    message: "Review updated successfully!",
    updatedReview,
  });
});

// delete review
const deleteReview = catchAsync(async (req, res, next) => {
  const { campgroundId, reviewId } = req.params;

  // update review reference in campground
  await Campground.findByIdAndUpdate(campgroundId, {
    $pull: { reviews: reviewId },
  });

  const review = await Review.findByIdAndDelete(reviewId);
  res.status(StatusCodes.OK).json({
    message: "Review deleted successfully!",
    id: review._id,
  });
});

module.exports = {
  createReview,
  getReview,
  getReviews,
  updateReview,
  deleteReview,
};

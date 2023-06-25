const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const Campground = require("../models/CampgroundModel");
const catchAsync = require("../utils/catchAsync");
const { deleteImage } = require("../utils/cloudinary");
const geocodeLocation = require("../utils/geocodeLocation");
const paginationAndFilter = require("../utils/paginationAndFilter");

// create campground
const createCampground = catchAsync(async (req, res, next) => {
  const { title, price, description, location } = req.body;

  // get geoLocation from mapBox
  const geoLocation = await geocodeLocation(location);

  const campground = new Campground({
    author: req.user._id,
    title,
    price,
    description,
    location,
    geoLocation,
  });

  campground.images = req.files.map((file) => ({
    url: file.path,
    cloudinary_id: file.filename,
  }));

  await campground.save();
  if (campground) {
    res.status(StatusCodes.CREATED).json({
      message: "New campground added successfully!",
      campground,
    });
  }
});
// get a campground by id
const getCampground = catchAsync(async (req, res, next) => {
  const campground = await Campground.findById(
    req.params.campgroundId
  ).populate([
    {
      path: "reviews",
      select: "rating",
      populate: [{ path: "author", select: "username" }], // populate author of reviews with only username
    },
    { path: "author" }, // populate author of a campground
  ]);
  if (!campground) {
    throw new NotFoundError("Campground not found!");
  }
  res.status(StatusCodes.OK).json({ campground });
});

// get all campgrounds
const getCampgrounds = catchAsync(async (req, res, next) => {
  const { page, limit, searchLocation } = req.query;
  const paginationOptions = { page, limit };
  let queryOptions = {};
  if (searchLocation)
    queryOptions.location = { $regex: searchLocation, $options: "i" };

  // array destructuring
  let [lowerRange, higherRange] = [
    parseInt(req.query.lowerRange) || 0,
    parseInt(req.query.higherRange) || Infinity,
  ];
  // swap variables in case of invalid range
  if (lowerRange > higherRange)
    [lowerRange, higherRange] = [higherRange, lowerRange];

  // set range for price filter
  if (lowerRange && higherRange)
    queryOptions.price = { $gte: lowerRange, $lte: higherRange };
  else if (lowerRange) queryOptions.price = { $gte: lowerRange };
  else if (higherRange) queryOptions.price = { $lte: higherRange };

  const { data, totalPages, currentPage, totalDocs } =
    await paginationAndFilter(Campground, paginationOptions, queryOptions);
  res
    .status(StatusCodes.OK)
    .json({ campgrounds: data, totalPages, currentPage, totalDocs });
});

// update campground
const updateCampground = catchAsync(async (req, res, next) => {
  const { title, price, description, location, deletedImages } = req.body;

  // only look for geoLocation if location is provided by the user
  let geoLocation;
  if (location) {
    geoLocation = await geocodeLocation(location);
  }
  // update geoLocation if location is provided by user
  const updatedCampground = await Campground.findByIdAndUpdate(
    req.params.campgroundId,
    {
      $set: {
        // use $set to only change selected fields
        title,
        price,
        description,
        location,
        geoLocation: location ? geoLocation : undefined,
      },
    },
    { new: true, runValidators: true }
  );

  // delete images if provided by user
  if (deletedImages && deletedImages.length) {
    for (let image_id of deletedImages) {
      await deleteImage(image_id);
    }
    await updatedCampground.updateOne({
      $pull: { images: { cloudinary_id: { $in: deletedImages } } },
    });
  }

  // update campground with new images if provided by user
  if (req.files && req.files.length) {
    const images = req.files.map((file) => ({
      url: file.path,
      cloudinary_id: file.filename,
    }));
    updatedCampground.images.push(...images);
  }
  await updatedCampground.save();

  res.status(StatusCodes.OK).json({
    message: "Campground updated successfully!",
    updatedCampground,
  });
});

// delete campground
const deleteCampground = catchAsync(async (req, res, next) => {
  const campground = await Campground.findByIdAndDelete(
    req.params.campgroundId
  );

  res.status(StatusCodes.OK).json({
    message: "Campground deleted successfully!",
    id: campground.id,
  });
});

module.exports = {
  createCampground,
  getCampground,
  getCampgrounds,
  updateCampground,
  deleteCampground,
};

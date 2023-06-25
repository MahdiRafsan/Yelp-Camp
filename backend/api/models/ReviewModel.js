const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please provide text for review!"],
    },
    rating: {
      type: Number,
      required: [true, "Please provide a rating for this campground!"],
      min: 1,
      max: 5,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reviews must be made by a user!"],
    },
    campground: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campground",
      required: [true, "Reviews must be attached to a campground!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

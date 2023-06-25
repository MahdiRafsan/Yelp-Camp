const mongoose = require("mongoose");
const validator = require("validator");
const opts = { toJSON: { virtuals: true } };
const Review = require("./ReviewModel");
const { deleteImage } = require("../utils/cloudinary");

const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  cloudinary_id: String, // cloudinary public_id
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is a required field!"],
      trim: true,
      validate: {
        validator: (value) => validator.isLength(value, { max: 100 }),
        message: (props) =>
          `Campground title can't be longer than 100 characters. Got ${props.value.length} characters!`,
      },
    },
    images: [imageSchema],
    price: {
      type: Number,
      required: [true, "Price of campground is a required field!"],
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location of campground must be specified!"],
    },
    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    // COMPLETE LATER
    // avgRating: { type: Number, default: 0 },
  },
  { timestamps: true },
  opts
);

// campgroundSchema.virtual("properties.popUpMarkup").get(function () {
//   return `
//         <strong><a href="/campgrounds/${this._id}"> ${this.title} </a></strong>
//         <p>${this.description.substring(0, 45)}...</p>`;
// });

// IMPLEMENT AVERAGE RATING OF EACH CAMPGROUND

// delete associated reviews and images upon deleting a campground
campgroundSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
    for (let image of doc.images) {
      await deleteImage(image.cloudinary_id);
    }
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);

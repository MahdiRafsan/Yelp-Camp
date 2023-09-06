const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Campground = require("./CampgroundModel");
const Review = require("./ReviewModel");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    oAuthProvider: { type: String },
    oAuthId: { type: String },
    username: {
      type: String,
      required: [true, "Username is a required field!"],
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      validate: [
        {
          validator: (value) => validator.isLength(value, { min: 5, max: 20 }),
          message: (props) =>
            `Username should be between 5-20 characters. Got ${props.value.length} characters!`,
        },
        {
          validator: (value) => validator.isAlphanumeric(value),
          message: (props) =>
            `Username should only contain alphabets and numbers!`,
        },
      ],
    },
    email: {
      type: String,
      required: [true, "Email is a required field!"],
      lowercase: true,
      trim: true,
      unique: true,
      uniqueCaseInsensitive: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [
        function () {
          return this.oAuthProvider !== "Google";
        },
        "Password is a required field!",
      ],
      select: false,
      validate: {
        validator: (value) => validator.isStrongPassword(value),
        message:
          "Password should contain atleast 1 uppercase, 1 lowercase, 1 number, and 1 symbol and be atleast 8 characters long.",
      },
    },

    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    bio: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => validator.isLength(value, { max: 300 }),
        message: (props) =>
          `Bio can't be more than 300 characters. Got ${props.value.length} characters!`,
      },
    },
    profile_pic: {
      url: { type: String, trim: true },
      cloudinary_id: { type: String, trim: true },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }, // include timestamps
  { toJSON: { virtuals: true } } // <-- include virtuals in `JSON.stringify()`
);

userSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

userSchema.plugin(uniqueValidator, {
  message:
    "An user with that {PATH} already exists! Please use a different value.",
});

// middleware to hash password before saving to database
userSchema.pre("save", async function (next) {
  // don't hash password if it has not been changed or updated
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// generate password reset tokens
userSchema.methods.generatePasswordResetToken = function () {
  const plainToken = crypto.randomBytes(16).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(plainToken)
    .digest("hex");
  this.resetToken = hashedToken; // store hashed Token in DB
  this.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // expires in 15 mins
  this.save(); // save token info to DB
  return plainToken; // send plain token to user
};

userSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    // find all campgrounds created by this author
    const campgrounds = await Campground.find({ author: doc._id });

    // delete all reviews associated to those campgrounds
    campgrounds.map(async (campground) => {
      await Review.deleteMany({ _id: { $in: campground.reviews } });
    });

    // delete all campgrounds created by this author
    await Campground.deleteMany({ author: doc._id });

    // delete all reviews created by this author
    await Review.deleteMany({ author: doc._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);

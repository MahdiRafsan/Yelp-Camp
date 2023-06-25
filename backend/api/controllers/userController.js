const { StatusCodes } = require("http-status-codes");

const { NotFoundError } = require("../errors");
const User = require("../models/UserModel");
const { deleteImage } = require("../utils/cloudinary");
const paginationAndFilter = require("../utils/paginationAndFilter");

const getAllUsers = async (req, res, next) => {
  const { page, limit, searchTerm, role } = req.query;

  const paginationOptions = { page, limit };
  let queryOptions = {};

  // search by username, email or role
  if (searchTerm) {
    queryOptions.$or = [
      { username: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
    ];
  }
  if (role) queryOptions.role = role;

  const { data, totalPages, currentPage, totalDocs } =
    await paginationAndFilter(User, paginationOptions, queryOptions);
  res
    .status(StatusCodes.OK)
    .json({ users: data, totalPages, currentPage, totalDocs });
};

const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.userId).select("-password");

  if (!user) {
    throw new NotFoundError(
      `No user with the id ${req.params.userId} is found in the database!`
    );
  }
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res, next) => {
  const { username, email, firstName, lastName, bio } = req.body;

  const user = await User.findById(req.params.userId).select("-password");
  if (!user) {
    throw new NotFoundError(
      `No user with the id ${req.params.userId} is found in the database!`
    );
  }

  // delete previous image from cloudinary if user is uploading a new image
  if (req.file && user.profile_pic.cloudinary_id) {
    await deleteImage(user.profile_pic.cloudinary_id);
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.params.userId },
    {
      $set: {
        username,
        email,
        firstName,
        lastName,
        bio,
        "profile_pic.url": req.file && req.file.path,
        "profile_pic.cloudinary_id": req.file && req.file.filename,
      },
    },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({
    message: "Account updated successfully.",
    updatedUser,
  });
};

const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    throw new NotFoundError(
      `No user with the id ${req.params.userId} is found in the database!`
    );
  }

  // delete image from cloudinary
  if (user.profile_pic && user.profile_pic.cloudinary_id) {
    await deleteImage(user.profile.image.cloudinary_id);
  }

  res.status(StatusCodes.OK).json({ message: "User deleted successfully" });
};
module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};

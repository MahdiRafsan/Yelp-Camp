const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/UserModel");
const { generateAccessToken } = require("../utils/jwt");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const register = catchAsync(async (req, res, next) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    bio,
  } = req.body;

  if (password && !confirmPassword) {
    throw new BadRequestError("Confirm password is a required field!");
  }

  if (password !== confirmPassword) {
    throw new BadRequestError("Passwords must match!");
  }

  // register first user as admin
  const existingAdmin = await User.exists({ role: "admin" });
  if (!existingAdmin) {
    const adminUser = await User.create({
      email,
      username,
      password,
      firstName,
      lastName,
      bio,
      role: "admin",
    });

    return res.status(StatusCodes.CREATED).json({
      message: "New user registered successfully.",
      token: generateAccessToken(adminUser._id),
      user: { ...adminUser._doc, password: undefined },
    });
  }

  // register all subsequent users as user
  const user = await User.create({
    email,
    username,
    password,
    firstName,
    lastName,
    bio,
  });

  res.status(StatusCodes.CREATED).json({
    message: "New user registered successfully.",
    token: generateAccessToken(user._id),
    user: { ...user._doc, password: undefined },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    throw new BadRequestError(
      "Username or email and password must be provided for login!"
    );
  }

  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  }).select("+password");

  if (!user) {
    throw new NotFoundError("No user found with that username or email!");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid Credentials!");
  }

  res.status(StatusCodes.OK).json({
    message: "Login successful!",
    token: generateAccessToken(user._id),
    user: { id: user._id, fullName: user.fullName },
  });
});

module.exports = { register, login };

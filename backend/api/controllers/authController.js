const { OAuth2Client } = require("google-auth-library");

const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/UserModel");
const { generateAccessToken } = require("../utils/jwt");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

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
  // register all subsequent users as user
  const existingAdmin = await User.exists({ role: "admin" });
  const user = await User.create({
    email,
    username,
    password,
    firstName,
    lastName,
    bio,
    role: existingAdmin ? "user" : "admin",
  });

  res.status(StatusCodes.CREATED).json({
    message: "New user registered successfully.",
    token: generateAccessToken(user._id),
    userId: user._id,
    user: { ...user.toObject(), fullName: user.fullName },
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
    userId: user._id,
    user: { ...user.toObject(), fullName: user.fullName },
  });
});

const googleOAuthLogin = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const { tokens } = await oAuth2Client.getToken(code);

  // decode the token
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload(); // JSON with all user info

  if (payload.email_verified) {
    // first database user is always admin
    const existingAdmin = await User.exists({ role: "admin" });
    // proceed to login for existing google users
    // oAuthId (sub from google payload) is unique
    const existingGoogleUser = await User.findOne({ oAuthId: payload.sub });
    if (existingGoogleUser) {
      return res.status(StatusCodes.OK).json({
        message: "Login successful!",
        token: generateAccessToken(existingGoogleUser._id),
        userId: existingGoogleUser._id,
        user: {
          ...existingGoogleUser.toObject(),
          fullName: existingGoogleUser.fullName,
        },
      });
    } else {
      // show error for existing users trying to login with google
      const existingEmailUser = await User.findOne({ email: payload.email });
      if (existingEmailUser) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Email conflict! Use your existing account to login.",
        });
      }
    }

    const username = payload.email.slice(0, payload.email.indexOf("@"));
    const newUser = await User.create({
      oAuthProvider: "Google",
      oAuthId: payload.sub,
      email: payload.email,
      username: username,
      firstName: payload.given_name,
      lastName: payload.family_name,
      "profile_pic.url": payload.picture,
      role: existingAdmin ? "user" : "admin",
    });

    res.status(StatusCodes.CREATED).json({
      message: "New user registered successfully.",
      token: generateAccessToken(newUser._id),
      userId: newUser._id,
      user: { ...newUser.toObject(), fullName: newUser.fullName },
    });
  }
});

module.exports = { register, login, googleOAuthLogin };

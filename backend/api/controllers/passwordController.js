const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const { NotFoundError, BadRequestError } = require("../errors");
const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
const { sendEmail, resetEmail, confirmationEmail } = require("../utils/email");
const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.params.userId).select("+password");
  if (!user) {
    throw new NotFoundError(
      `No user with the id ${req.params.userId} is found in the database!`
    );
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new BadRequestError(
      "Please provide the values for current, new and confirm password fields!"
    );
  }

  const validCurrentPassowrd = await user.comparePassword(currentPassword);
  if (!validCurrentPassowrd) {
    throw new BadRequestError(
      "Password stored in the database doesn't match with the provided current password!"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError(
      "Values for new and confirm password fields must match!"
    );
  }

  const newPasswordCurrentlyInUse = await user.comparePassword(newPassword);
  if (newPasswordCurrentlyInUse) {
    throw new BadRequestError(
      "New password must be different from the current password!"
    );
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({
    message: "Success! Your password has been updated.",
  });
});
const initiatePasswordReset = catchAsync(async (req, res, next) => {
  // get user based on provided email
  const { usernameOrEmail } = req.body;
  if (!usernameOrEmail) {
    throw new BadRequestError("Please provide an email or a username!");
  }

  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  });

  if (!user) {
    throw new NotFoundError(
      "No user with that email or username is found! Please enter a different value."
    );
  }

  // generate plain reset token and store hashed version in DB
  const resetToken = user.generatePasswordResetToken();

  // send email with reset link to user
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/${resetToken}`;
  const resetMessage = resetEmail(resetUrl);

  try {
    sendEmail({
      email: user.email,
      subject: "Yelp-Camp Password Reset",
      message: resetMessage,
    });
    res.status(StatusCodes.ACCEPTED).json({
      message: `An email has been sent to ${user.email} with further instructions.`,
    });
  } catch (err) {
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the passowrd reset email! Please try again later!"
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  }).select("+password");
  
  if (!user) {
    throw new BadRequestError("Invalid Password Reset URL!");
  }

  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword) {
    throw new BadRequestError(
      "Both password and confirm password values must be provided!"
    );
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError("Passwords must match!");
  }

  const newPasswordCurrentlyInUse = await user.comparePassword(newPassword);
  if (newPasswordCurrentlyInUse) {
    throw new BadRequestError(
      "New password must be different from the current password!"
    );
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  const confirmMessage = confirmationEmail();

  sendEmail({
    email: user.email,
    subject: "Password Reset Successfully",
    message: confirmMessage,
  });
  res.status(StatusCodes.OK).json({
    message: "Success! Your password has been updated.",
  });
});

module.exports = { updatePassword, initiatePasswordReset, resetPassword };

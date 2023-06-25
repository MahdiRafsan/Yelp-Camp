const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");
const { validateAccessToken } = require("../utils/jwt");
const User = require("../models/UserModel");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token = authHeader.split(" ")[1];
      const isCustomAuth = token && token.length < 500;
      let decoded;

      if (!token) {
        throw new UnauthorizedError("Invalid authorization. No token!");
      }
      decoded = isCustomAuth ? validateAccessToken(token) : jwt.decode(token);
      req.user = await User.findById(decoded.payload.toString());

      //   if (token && isCustomAuth) {
      //     decoded = validateAccessToken(token);
      //     req.user = await User.findById(decoded.id).select("-password");
      //   } else {
      //     decoded = jwt.decode(token);
      //     req.user = await User.findById(decoded.id).select("-password");
      //   }
      next();
    } else {
      throw new UnauthorizedError(
        "You must be logged in to access this resource!"
      );
    }
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;

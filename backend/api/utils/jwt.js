const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) => {
  return jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const validateAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = { generateAccessToken, validateAccessToken };

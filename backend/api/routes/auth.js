const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleOAuthLogin,
} = require("../controllers/authController");

// public
router.post("/register", register);
router.post("/login", login);
router.post("/login/google", googleOAuthLogin);
module.exports = router;

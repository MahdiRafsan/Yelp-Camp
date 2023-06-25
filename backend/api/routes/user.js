const express = require("express");
const multer = require("multer");

const router = express.Router();
const { storage, isValidImage } = require("../utils/cloudinary");

const isAuthorized = require("../middlewares/authMiddleware");
const { isOwner } = require("../middlewares/checkPermissions");

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  updatePassword,
  initiatePasswordReset,
  resetPassword,
} = require("../controllers/passwordController");

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => isValidImage(file, cb),
});

// private
// only accessible to admin
router.get("/", isAuthorized, isOwner, getAllUsers);

// private
// accessible to only admin and owner
router.get("/:userId", isAuthorized, isOwner, getUser);
// router.patch("/:id", isAuthorized, upload.single("image"), updateUser);
router.patch(
  "/:userId",
  isAuthorized,
  isOwner,
  upload.single("image"),
  updateUser
);

// private
// only accessible to owner
router.delete("/:userId", isAuthorized, isOwner, deleteUser);

router.patch("/password/:userId", isAuthorized, isOwner, updatePassword);
router.post("/password", initiatePasswordReset);
router.put("/password/:resetToken", resetPassword);
module.exports = router;

const express = require("express");
const multer = require("multer");

const router = express.Router();
const { storage, isValidImage } = require("../utils/cloudinary");

const isAuthorized = require("../middlewares/authMiddleware");
const { isCampgroundOwner } = require("../middlewares/checkPermissions");
const {
  createCampground,
  getCampground,
  getCampgrounds,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgroundsController");

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => isValidImage(file, cb),
});

// private
// accessible to all users
router.get("/:campgroundId", isAuthorized, getCampground);
router.get("/",  getCampgrounds);

// private
router.post("/", isAuthorized, upload.array("images"), createCampground);

// private but only accessible to admin and owner
router.patch(
  "/:campgroundId",
  isAuthorized,
  isCampgroundOwner,
  upload.array("images"),
  updateCampground
);

router.delete(
  "/:campgroundId",
  isAuthorized,
  isCampgroundOwner,
  deleteCampground
);

module.exports = router;

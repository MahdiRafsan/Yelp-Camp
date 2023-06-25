const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { BadRequestError } = require("../errors");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const UPLOAD_OPTIONS = {
  folder: "Yelp-Camp",
  allowed_formats: ["png", "jpg", "jpeg"],
  transformation: [{ width: 200, height: 200, crop: "fill" }],
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: UPLOAD_OPTIONS,
});

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    throw err;
  }
};

const isValidImage = (file, cb) => {
  const allowedExtensions = ["jpeg", "jpg", "png"];
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

  const fileExtension = file.originalname
    .substring(file.originalname.lastIndexOf(".") + 1)
    .toLowerCase();

  const isValidExt = allowedExtensions.includes(fileExtension);
  const isValidMimeType = allowedMimeTypes.includes(file.mimetype);

  const isValid = isValidExt && isValidMimeType;
  return isValid
    ? cb(null, true)
    : cb(new BadRequestError("Image must be either png or jpg/jpeg!"), false);
};

module.exports = { storage, deleteImage, isValidImage };

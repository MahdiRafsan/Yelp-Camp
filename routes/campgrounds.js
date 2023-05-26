const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const { isAuthorized, isAuthor, validateCampground } = require('../utils/middleware');

const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({storage});

const campgrounds = require('../controllers/campgrounds')

router.get('/', wrapAsync(campgrounds.index))

router.get('/new', isAuthorized, campgrounds.renderNewForm)

router.get('/:id', wrapAsync(campgrounds.showCampground))

router.get('/:id/edit', isAuthorized, isAuthor, wrapAsync(campgrounds.renderEditForm))

router.post('/', isAuthorized, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground))

router.put('/:id', isAuthorized, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))

router.delete('/:id', isAuthorized, isAuthor, wrapAsync(campgrounds.deleteCampground))

module.exports = router;

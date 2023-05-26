const express = require('express');
const router = express.Router({mergeParams: true});

const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isAuthorized, isReviewAuthor } = require('../utils/middleware');
const reviews = require('../controllers/reviews');

router.post('/', isAuthorized, validateReview, wrapAsync(reviews.createReview))

router.delete('/:reviewId', isAuthorized, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;
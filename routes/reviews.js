const express = require('express');
// We need to merge the params from the campgrounds route with the params from the reviews route. We do this by setting mergeParams to true.
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');
const { reviewSchema } = require('../schemas.js');
const validateSchema = require('../utilities/validateSchema');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateSchema(reviewSchema), catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
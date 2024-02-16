const express = require('express');
// We need to merge the params from the campgrounds route with the params from the reviews route. We do this by setting mergeParams to true.
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utilities/catchAsync');
const { reviewSchema } = require('../schemas.js');
const validateSchema = require('../utilities/validateSchema');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');

router.post('/', validateSchema(reviewSchema), catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // $pull is a MongoDB operator that removes from an existing array all instances of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const validateSchema = require('../utilities/validateSchema');
// const Campground = require('../models/campground');
const { isLoggedIn, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds');

// using .route to group routes with the same path
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateSchema(campgroundSchema), catchAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateSchema(campgroundSchema), catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const validateSchema = require('../utilities/validateSchema');
// const Campground = require('../models/campground');
const { isLoggedIn, isAuthor } = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateSchema(campgroundSchema), catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, validateSchema(campgroundSchema), catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground));

module.exports = router;
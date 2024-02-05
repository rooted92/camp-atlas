const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const { campgroundSchema } = require('./schemas.js');

// Models
const Campground = require('./models/campground');
const Review = require('./models/review');

mongoose.connect('mongodb://127.0.0.1:27017/camp-atlas');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // details is an array so it could have multiple errors. We're going to map over the array and join the errors together with a comma.
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

app.get('/', (req, res) => {
    res.render('home.ejs')
});

// Campgrounds CRUD ******************************************************
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds });
}));

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new.ejs');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// .all is for all HTTP verbs (every request). Will only run if no other route matches (i.e. if we get a bad request)
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Here is our error handler. It will run if we pass an error to next() or if we throw an error. 
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    // If we don't have a message, set it to 'Something went wrong'
    // Why wouldn't we have a message? If we don't have a message, it's probably because we didn't pass one in when we created the error. This would happen if we didn't catch an error in our catchAsync function. If we don't catch an error, we don't pass it a message, so it won't have a message.
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error.ejs', { err });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
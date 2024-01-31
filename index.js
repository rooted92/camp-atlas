const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');

// Models
const Campground = require('./models/campground');

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

app.post('/campgrounds', catchAsync(async (req, res, next) => {
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

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));

// .all is for all HTTP verbs (every request). Will only run if no other route matches (i.e. if we get a bad request)
app.all('*', (req, res, next) => { 
    next(new ExpressError('Page Not Found', 404));
});

// Here is our 
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
    res.send("Oh boy, something went wrong!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
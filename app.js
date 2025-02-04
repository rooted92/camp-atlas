const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/camp-atlas');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use((request, response, next) => {
    console.log(request.method.toUpperCase());
    next();
});

app.use('/dogs', (request, response, next) => {
    console.log('I love dogs');
    next();
});

app.get('/', (require, response) => {
    response.render('home.ejs');
});

app.get('/campgrounds', async (require, response) => {
    const campgrounds = await Campground.find({});
    response.render('campgrounds/index.ejs', { campgrounds });
});

app.get('/campgrounds/new', (require, response) => {
    response.render('campgrounds/new.ejs');
});

app.post('/campgrounds', async (require, response) => {
    const campground = new Campground(require.body.campground);
    await campground.save();
    response.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (require, response) => {
    const { id } = require.params;
    const campground = await Campground.findById(id);
    response.render('campgrounds/show.ejs', { campground });
});

app.get('/campgrounds/:id/edit', async (require, response) => {
    const { id } = require.params;
    const campground = await Campground.findById(id);
    response.render('campgrounds/edit.ejs', { campground });
});

app.put('/campgrounds/:id', async (require, response) => {
    const { id } = require.params;
    // the spread operator is used to copy all properties from the body to the campground object
    const campground = await Campground.findByIdAndUpdate
        (id, { ...require.body.campground });
    response.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (require, response) => {
    const { id } = require.params;
    await Campground.findByIdAndDelete(id);
    response.redirect('/campgrounds');
});

app.use((request, response) => {
    response.status(404).send('Page not found');
});

app.listen(3000, () => {
    console.log('Listening on port: 3000');
});
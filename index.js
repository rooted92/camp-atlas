const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Routes
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');

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
app.use(cookieParser('thisismysecret'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};

// app.use session should be used before passport.session
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// We would like to sue the local strategy to authenticate users. We will use the User.authenticate method that comes from passportLocalMongoose. This method is added to the User model when we use passportLocalMongoose as a plugin in the User model.
passport.use(new LocalStrategy(User.authenticate()));

// This tells passport how to serialize a user. This means that passport will determine what data from the user object should be stored in the session. We are storing the user's id in the session. This is what passport.serializeUser does. It determines what data from the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. This is what is stored in the session. We are storing the user's id in the session. When we need to retrieve the user from the session, passport will use the id that is stored in the session to retrieve the user object.
// Basically how to store and unstore the user in the session.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting up a middleware to handle all of our flash messages from every request.
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});



app.get('/', (req, res) => {
    res.render('home.ejs')
});

// app.get('/getsignedcookie', (req, res) => {
//     res.cookie('isBigFoot', true, { signed: true });
//     res.send('Signed the cookie');
// });

// app.get('/verifycookie', (req, res) => {
//     console.log(req.signedCookies);
//     res.send(req.signedCookies);
// });

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

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
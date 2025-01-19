const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/camp-atlas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (require, response) => {
   response.render('home.ejs');
});

app.get('/makecampground', async (require, response) => {
    const camp = new Campground({name: 'My Backyard', price: 'Free', description: 'A large backyard', location: 'My House'});
    await camp.save();
    response.render('makecampground.ejs');
});

app.listen(3000, () => {
    console.log('Listening on port: 3000');
});
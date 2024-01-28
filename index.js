const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');

// Models
const Campground = require('./models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/camp-atlas');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home.ejs')
});

app.get('/makecampground', async (req, res) => {
    const camp = new Campground(
        {
            title: 'My Backyard',
            price: 0,
            description: 'Cheap camping!'
        }
    );
    await camp.save(); 
    res.send(camp);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
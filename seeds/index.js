const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/camp-atlas', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function getRandomImage() {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'l4jBZU6_2zq0cuR4as_XKLDmiEARRILgl9oJpKFf6Ls',
          collections: 1114848,
        },
      })
      return response.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await getRandomImage(),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil cum voluptates quaerat amet autem at quis labore ad numquam modi deserunt distinctio excepturi quisquam, ipsa dignissimos quae vero asperiores repellat!',
            price,
        });
        await camp.save();
    }
}

seedDB().then(() => { mongoose.connection.close(); });
const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campGround');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 1; i <= 100; i++) {
        const price = Math.floor(Math.random() * 1000) + 1;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '615c5b5da5c072921120e0bf',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            discription: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, dignissimos. Est repudiandae laudantium quae ad autem cupiditate, itaque neque, culpa asperiores, excepturi unde corrupti nobis debitis quia. Ipsam, beatae animi.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/yelp-campground/image/upload/v1633341585/yelp-camp/mtwi5eitewmhmjhtmwrn.jpg',
                    filename: 'yelp-camp/mtwi5eitewmhmjhtmwrn',
                }
            ]
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})
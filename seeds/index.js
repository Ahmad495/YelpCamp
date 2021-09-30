const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campGround');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
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
    for (let i = 1; i <= 50; i++) {
        const price = Math.floor(Math.random() * 1000) + 1;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '61482d28a94cb6170c823aab',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            discription: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dicta, dignissimos. Est repudiandae laudantium quae ad autem cupiditate, itaque neque, culpa asperiores, excepturi unde corrupti nobis debitis quia. Ipsam, beatae animi.',
            price,
            geometry: {
                type: "Point",
                coordinates: [-116.84605395, 34.23066445]
            },
            image: [
                {
                    url: 'https://res.cloudinary.com/yelp-campground/image/upload/v1632650225/yelp-camp/wlltxbtv7to0ggqk18sq.jpg',
                    filename: 'yelp-camp/wlltxbtv7to0ggqk18sq',
                }
            ]
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
})
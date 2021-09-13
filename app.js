const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');


const Campground = require('./models/campGround');
const Review = require('./models/review');


const campgroundRouter = require('./routes/campground');
const reviewRouter = require('./routes/reviews');


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


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);


app.get('/', (req, res) => {
    res.send("YelpCamp");
})


app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not found'));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    }
    res.status(statusCode).render('error', { err, statusCode });
})

app.listen(3000, () => {
    console.log("Listening on port 3000!");
})
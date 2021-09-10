const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const { joiValidationSchema, reviewValidationSchema } = require('./serverSideValidation.js');


const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campGround');
const Review = require('./models/review');
const { required } = require('joi');


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

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validationCampground = (req, res, next) => {
    const { error } = joiValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

const validationReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.send("YelpCamp");
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validationCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validationReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    const reviews = new Review(req.body.review);
    campgrounds.reviewsRef.push(reviews);
    await campgrounds.save();
    await reviews.save();
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))

app.put('/campgrounds/:id', validationCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.delete('/campgrounds/:campgroundID/reviews/:reviewID', catchAsync(async (req, res) => {
    const { reviewID, campgroundID } = req.params;
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviewsRef: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campgroundID}`);
}))

// app.get('/campgrounds/:id/reviews/show', catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const campgrounds = await Campground.findById(id).populate('reviewsRef');
//     res.render('reviews/show', { campgrounds });
// }))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
        throw new ExpressError(404, 'CampGround not found');
    }
    res.render('campgrounds/edit', { campgrounds });
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate('reviewsRef');
    if (!campgrounds) {
        throw new ExpressError(404, 'CampGround not found');
    }
    res.render('campgrounds/show', { campgrounds });
}))

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
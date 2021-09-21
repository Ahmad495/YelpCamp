const express = require('express');
const router = express.Router({ mergeParams: true });


const Campground = require('../models/campGround');
const Review = require('../models/review');


const catchAsync = require('../utils/catchAsync');



const { isLoggedIn, isAuthorReview, validationReview } = require('../Middleware');



router.post('/', isLoggedIn, validationReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    const reviews = new Review(req.body.review);
    campgrounds.reviewsRef.push(reviews);
    reviews.author = req.user._id;
    await campgrounds.save();
    await reviews.save();
    req.flash('success', 'review created');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))

router.delete('/:reviewID', isLoggedIn, isAuthorReview, catchAsync(async (req, res) => {
    const { reviewID, id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviewsRef: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('deleted', 'review deleted');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });


const Campground = require('../models/campGround');
const Review = require('../models/review');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const joi = require('joi');
const { required } = require('joi');
const { reviewValidationSchema } = require('../serverSideValidation.js');

const validationReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

router.post('/', validationReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    const reviews = new Review(req.body.review);
    campgrounds.reviewsRef.push(reviews);
    await campgrounds.save();
    await reviews.save();
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))

router.delete('/:reviewID', catchAsync(async (req, res) => {
    const { reviewID, campgroundID } = req.params;
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviewsRef: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campgroundID}`);
}))

module.exports = router;
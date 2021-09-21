const express = require('express');
const router = express.Router({ mergeParams: true });


const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campGround');

const { isLoggedIn, validationCampground, isAuthorCampground } = require('../Middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validationCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.put('/:id', isLoggedIn, isAuthorCampground, validationCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully edited campground');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', isLoggedIn, isAuthorCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

router.get('/:id/edit', isLoggedIn, isAuthorCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds });
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate({ path: 'reviewsRef', populate: { path: 'author' } }).populate('author');
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds });
}))


module.exports = router;
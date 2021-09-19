const express = require('express');
const router = express.Router({ mergeParams: true });


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const Campground = require('../models/campGround');


const { joiValidationSchema } = require('../serverSideValidation');

const { isLoggedIn } = require('../loginMiddleware');



const validationCampground = (req, res, next) => {
    const { error } = joiValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validationCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.put('/:id', isLoggedIn, validationCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully edited campground');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash('deleted', 'campground has been deleted')
    res.redirect('/campgrounds');
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
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
    const campgrounds = await Campground.findById(id).populate('reviewsRef');
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds });
}))


module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const Campground = require('../models/campGround');


const { joiValidationSchema } = require('../serverSideValidation');



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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validationCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds');
}))

router.put('/:id', validationCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
        throw new ExpressError(404, 'CampGround not found');
    }
    res.render('campgrounds/edit', { campgrounds });
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate('reviewsRef');
    if (!campgrounds) {
        throw new ExpressError(404, 'CampGround not found');
    }
    res.render('campgrounds/show', { campgrounds });
}))


module.exports = router;
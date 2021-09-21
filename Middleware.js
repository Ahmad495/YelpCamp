const Campground = require('./models/campGround');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const { joiValidationSchema, reviewValidationSchema } = require('./serverSideValidation');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Logged In');
        return res.redirect('/login');
    }
    next();
}


module.exports.validationCampground = (req, res, next) => {
    const { error } = joiValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

module.exports.validationReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

module.exports.isAuthorCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'You dont have the permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.isAuthorReview = async (req, res, next) => {
    const { reviewID, id } = req.params;
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You dont have the permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}



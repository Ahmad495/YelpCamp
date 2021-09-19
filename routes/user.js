const express = require('express');
const router = express.Router();

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { userRegisterValidation } = require('../serverSideValidation');
const passport = require('passport');

const validationUser = (req, res, next) => {
    const { error } = userRegisterValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', validationUser, catchAsync(async (req, res) => {
    const { username, email, password } = req.body.user;
    const user = new User({ email, username });
    try {
        const registeredUser = await User.register(user, password);
        req.flash('success', 'User Registered');
        res.redirect('/campgrounds');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'You Have Logged In!');
    res.redirect('/campgrounds');
})

module.exports = router;


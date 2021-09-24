const express = require('express');
const router = express.Router();

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { userRegisterValidation } = require('../serverSideValidation');
const passport = require('passport');

const userController = require('../controllers/userController');

const validationUser = (req, res, next) => {
    const { error } = userRegisterValidation.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(404, msg);
    } else {
        next();
    }
}

router.get('/register', userController.createUserForm);

router.post('/register', validationUser, catchAsync(userController.createNewUser));

router.get('/login', userController.loginUserForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser);

router.get('/logout', userController.logoutUser);

module.exports = router;


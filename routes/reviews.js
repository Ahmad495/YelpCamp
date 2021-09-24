const express = require('express');
const router = express.Router({ mergeParams: true });


const Campground = require('../models/campGround');
const Review = require('../models/review');


const catchAsync = require('../utils/catchAsync');



const { isLoggedIn, isAuthorReview, validationReview } = require('../Middleware');

const reviewsController = require('../controllers/reviewsController')


router.post('/', isLoggedIn, validationReview, catchAsync(reviewsController.createNewReview))

router.delete('/:reviewID', isLoggedIn, isAuthorReview, catchAsync(reviewsController.deleteReview))

module.exports = router;
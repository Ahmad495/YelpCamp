const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campGround');
const { isLoggedIn, validationCampground, isAuthorCampground } = require('../Middleware');
const campgroundsController = require('../controllers/campgroundsController');
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });


router.get('/', catchAsync(campgroundsController.index));

router.get('/new', isLoggedIn, campgroundsController.newCampground);

router.post('/', isLoggedIn, upload.array('campground[image]'), validationCampground, catchAsync(campgroundsController.createNewCampground));

router.put('/:id', isLoggedIn, isAuthorCampground, upload.array('campground[image]'), validationCampground, catchAsync(campgroundsController.editCampground));

router.delete('/:id', isLoggedIn, isAuthorCampground, catchAsync(campgroundsController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthorCampground, catchAsync(campgroundsController.showCampgroundEidt));

router.get('/:id', catchAsync(campgroundsController.showCampground));


module.exports = router;
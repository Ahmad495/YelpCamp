const Review = require('../models/review');
const Campground = require('../models/campGround');

module.exports.createNewReview = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    const reviews = new Review(req.body.review);
    campgrounds.reviewsRef.push(reviews);
    reviews.author = req.user._id;
    await campgrounds.save();
    await reviews.save();
    req.flash('success', 'review created');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}


module.exports.deleteReview = async (req, res) => {
    const { reviewID, id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviewsRef: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('deleted', 'review deleted');
    res.redirect(`/campgrounds/${id}`);
}
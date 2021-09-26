const Campground = require('../models/campGround');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.showCampgroundEidt = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds });
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate({ path: 'reviewsRef', populate: { path: 'author' } }).populate('author');
    if (!campgrounds) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds });
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully edited campground');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash('deleted', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}

module.exports.createNewCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}
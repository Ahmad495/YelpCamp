const Campground = require('../models/campGround');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

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
    console.log(req.body);
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campgrounds.image.push(...imgs);
    await campgrounds.save();
    if (req.body.deleteImage) {
        for (let filename of req.body.deleteImage) {
            await cloudinary.uploader.destroy(filename);
        }
        await campgrounds.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImage } } } });
        console.log(campgrounds);
    }
    req.flash('success', 'Successfully edited campground');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const findCampground = await Campground.findById(id);
    if (findCampground.image) {
        findCampground.image.forEach((img) => {
            cloudinary.uploader.destroy(img.filename);
        });
    }
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash('deleted', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}

module.exports.createNewCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}
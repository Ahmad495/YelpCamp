const { string, number } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: [
        imageSchema
    ],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    reviewsRef: [
        {
            type: Schema.Types.ObjectId, ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `<strong>
    <a class="btn btn-primary btn-sm" href="/campgrounds/${this._id}" role="button" style="text-decoration:none; color:white; border-radius:1rem;">${this.title}</a>
    </strong>`;
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviewsRef }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
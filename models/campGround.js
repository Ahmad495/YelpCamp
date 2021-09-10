const { string, number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
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
    reviewsRef: [
        {
            type: Schema.Types.ObjectId, ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Campground', CampgroundSchema);
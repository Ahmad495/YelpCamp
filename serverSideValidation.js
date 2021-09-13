const joi = require('joi');
const { required } = require('joi');
module.exports.joiValidationSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().required(),
        discription: joi.string().required(),
        location: joi.string().required()
    }).required()
});

module.exports.reviewValidationSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
})


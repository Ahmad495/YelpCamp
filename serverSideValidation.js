const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)
module.exports.joiValidationSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        // image: joi.string().required(),
        discription: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML()
    }).required(),
    deleteImage: joi.array()
});

module.exports.reviewValidationSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})

module.exports.userRegisterValidation = joi.object({
    user: joi.object({
        email: joi.string().required().escapeHTML(),
        username: joi.string().required().escapeHTML(),
        password: joi.string().required().escapeHTML()
    }).required()
})
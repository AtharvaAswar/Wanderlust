const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        image: Joi.object(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(1).max(10000),
        review: Joi.array()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
        createdAt: Joi.date()
    }).required()
});
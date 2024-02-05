const Joi = require('joi');

// This schema is not a Mongoose schema. It's a Joi schema. It's a schema for the data that we're expecting to receive from the user. We're going to use this schema for validation. We're going to validate the data that we receive from the user against this schema. If the data doesn't match the schema, we'll throw an error.
const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
    }).required()
})

module.exports = {campgroundSchema, reviewSchema};
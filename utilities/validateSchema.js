const ExpressError = require('./ExpressError');

const validateSchema = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            // details is an array so it could have multiple errors. We're going to map over the array and join the errors together with a comma.
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    }
};

module.exports = validateSchema;
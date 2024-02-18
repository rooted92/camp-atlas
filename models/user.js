const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // What is unique? this sets up the index so if you have middleware that checks for unique values, it will be faster
        unique: true
    },
});

// This will add a username, hash and salt field to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define the schema for User
const userSchema = new Schema({
    email: {
        type: String,
        required: true // Email is mandatory for each user
    }
});

// Add username, hash, salt fields and authentication methods
// provided by passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", userSchema);

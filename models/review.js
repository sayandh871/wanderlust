const { string, number } = require("joi"); // Not used in this file, but imported
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for a Review
const reviewSchema = new Schema({
    comment: String, // Review text/content

    rating: { // Rating score for the review
        type: Number,
        min: 1, // Minimum allowed rating
        max: 5  // Maximum allowed rating
    },

    CreatedAt: { // Timestamp when review is created
        type: Date,
        default: Date.now()
    },

    // Reference to the User who wrote the review
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

// Export the Review model
module.exports = mongoose.model("Review", reviewSchema);

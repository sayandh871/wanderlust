const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review");

// Define the schema for a listing
const listingschema = new schema({
    title: {
        type: String,
        required: true // Title is mandatory
    },
    description: String, // Optional description of the listing
    image: String,       // Image URL or path
    price: Number,       // Price of the listing
    location: String,    // Location (city, area, etc.)
    country: String,     // Country name

    // Array of references to Review documents
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    // Reference to the User who owns this listing
    owner: {
        type: schema.Types.ObjectId,
        ref: "User"
    }
});

// Middleware to delete all associated reviews when a listing is deleted
listingschema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Create the model from the schema
const listing = mongoose.model("listing", listingschema);

// Export the model for use in other files
module.exports = listing;

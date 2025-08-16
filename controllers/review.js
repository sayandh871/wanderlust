const Review = require("../models/review");
const listing = require("../models/listing");

/**
 * Create a new review for a specific listing
 */
module.exports.createReview = async (req, res) => {
    // Find the listing by ID from URL params
    let foundlisting = await listing.findById(req.params.id);

    // Create a new review object from request body
    let newReview = new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating
    });

    // Assign the currently logged-in user as the review author
    newReview.author = req.user._id;

    console.log(newReview);

    // Add the new review reference to the listing's reviews array
    foundlisting.reviews.push(newReview);

    // Save both the review and the updated listing
    await newReview.save();
    await foundlisting.save();

    // Flash success message and redirect to the listing's show page
    req.flash("success", "New Review create");
    res.redirect(`/listings/${foundlisting._id}`);
};

/**
 * Delete a review from a specific listing
 */
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review ID from the listing's reviews array
    await listing.findByIdAndUpdate(id, { pull: { reviews: reviewId } });

    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);

    // Flash success message and redirect back to the listing
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};

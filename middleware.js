// Import models, schemas, and utilities
const listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingschema, reviewSchema } = require("./schema");
const Review = require("./models/review");

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirecturl = req.originalUrl; // Store the URL user was trying to access
    req.flash("error", "You must be logged in to create listings");
    return res.redirect("/login");
  }
  next();
};

// Middleware to save redirect URL for post-login redirection
module.exports.saveredirecturl = (req, res, next) => {
  if (req.session.redirecturl) {
    res.locals.redirecturl = req.session.redirecturl;
  }
  next();
};

// Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let Listing = await listing.findById(id);
  if (!Listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission for this");
    return res.redirect("/listings");
  }
  console.log("Listing found:", Listing);


  next();
};

// Middleware to validate listing data using Joi schema
module.exports.validatelisting = (req, res, next) => {
  let { error } = listingschema.validate(req.body);
  if (error) {
    let errmsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errmsg); // Throw error with details
  } else {
    next();
  }
};

// Middleware to validate review data using Joi schema
module.exports.validatereview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

// Middleware to check if the logged-in user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

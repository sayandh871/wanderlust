const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync")
const ExpressError=require("../utils/ExpressError")
const {reviewSchema}=require("../schema")
const Review = require("../models/review");
const listing = require("../models/listing");



const validatereview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);  
  if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,error);      
  }else{
    next();
  }
}

// REVIEW: post route
router.post("/",validatereview,wrapAsync( async(req,res) => {
  let foundlisting = await listing.findById(req.params.id);
  let newReview = new Review({
      comment: req.body.review.comment,
      rating: req.body.review.rating
    });
  foundlisting.reviews.push(newReview);

  await newReview.save();
  await foundlisting.save();
  req.flash("success","New Review create");
  res.redirect(`/listings/${foundlisting._id}`);
}));

//delete review route
router.delete("/:reviewId",wrapAsync(async (req,res) => {
  let {id,reviewId} = req.params;

  await listing.findByIdAndUpdate(id,{pull:{reviews:reviewId}})
  await review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
}))

module.exports = router;
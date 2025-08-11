const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync")
const {validatereview,isLoggedIn,isReviewAuthor}= require("../middleware");
const reviewController = require("../controllers/review")




// REVIEW: post route
router.post("/",isLoggedIn,validatereview,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;
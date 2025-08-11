const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapasync");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware")
const listingController = require("../controllers/listings")


router
 .route("/")
 .get( wrapAsync(listingController.index))
 .post(isLoggedIn,isOwner,validatelisting, wrapAsync(listingController.createListing));

// NEW: Form to create new listing
router.get("/new",isLoggedIn,isOwner,listingController.renderNewForm);

// SHOW: Show one listing details
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT: Form to edit listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

// UPDATE: Update listing in DB
router.put("/:id" ,isLoggedIn,isOwner,validatelisting, wrapAsync(listingController.updateListing));

// DELETE: Remove listing from DB
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
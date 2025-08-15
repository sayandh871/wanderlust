const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapasync");
const {isLoggedIn,isOwner,validatelisting} = require("../middleware")
const listingController = require("../controllers/listings")
const multer  = require('multer')
const {storage} = require("../cloudconfig")
const upload = multer({storage})

router
 .route("/")
 .get( wrapAsync(listingController.index))
 .post(isLoggedIn,upload.single("listing[image]"),validatelisting, wrapAsync(listingController.createListing));



 router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validatelisting, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));


module.exports = router;
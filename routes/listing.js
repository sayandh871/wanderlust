const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapasync")
const ExpressError=require("../utils/ExpressError")
const {listingschema}=require("../schema")
const listing = require("../models/listing");


const validatelisting = (req,res,next) => {
  let {error} = listingschema.validate(req.body);  
  if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,error);      
  }else{
    next();
  }
}


// INDEX: Show all listings
router.get("/", wrapAsync(async (req, res) => {
  const alllistings = await listing.find({});
  res.render("listings/index.ejs", { alllistings });
}));

// NEW: Form to create new listing
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE: Add new listing to DB
router.post("/",validatelisting, wrapAsync(async (req, res) => {
  const newlisting = new listing(req.body.listing);
  await newlisting.save();
  req.flash("success","New listing created");
  res.redirect("/listings");
}));

// SHOW: Show one listing details
router.get("/:id", wrapAsync(async (req, res) => {      
  let { id } = req.params;
  const Listing = await listing.findById(id).populate("reviews");
  if(!Listing){
    req.flash("error","Listing your requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { Listing });
}));

// EDIT: Form to edit listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const Listing = await listing.findById(id);
  if(!Listing){
    req.flash("error","Listing your requested does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { Listing });
}));

// UPDATE: Update listing in DB
router.put("/:id",validatelisting, wrapAsync(async (req, res) => {
  if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listing");
  }
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success","Listing updated");
  res.redirect(`/listings/${id}`);
}));

// DELETE: Remove listing from DB
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted");
  console.log(deletedlisting);
  res.redirect("/listings");
}));

module.exports = router;
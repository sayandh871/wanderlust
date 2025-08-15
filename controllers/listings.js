const { response } = require("express");
const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

/**
 * GET /listings
 * Display all listings
 */
module.exports.index = async (req, res) => {
    const alllistings = await listing.find({});
    res.render("listings/index.ejs", { alllistings });
};

/**
 * GET /listings/new
 * Render form to create a new listing
 */
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

/**
 * GET /listings/:id
 * Show details for a specific listing
 */
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const Listing = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" } // Populate review authors
        })
        .populate("owner"); // Populate listing owner

    if (!Listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    console.log(Listing);
    res.render("listings/show.ejs", { Listing });
};

/**
 * POST /listings
 * Create a new listing
 */
module.exports.createListing = async (req, res) => {

    let response = await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id; // Assign current user as owner
    newlisting.image = {url,filename}
    newlisting.geometry = response.body.features[0].geometry;
    let savedlisting = await newlisting.save();
    console.log(savedlisting)
    savedlisting.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
};

/**
 * GET /listings/:id/edit
 * Render edit form for an existing listing
 */
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const Listing = await listing.findById(id);

    if (!Listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { Listing });
};

/**
 * PUT /listings/:id
 * Update an existing listing
 */
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    const { id } = req.params;
    let Listing=await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = {url,filename}
    await Listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

/**
 * DELETE /listings/:id
 * Delete a listing
 */
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    const deletedlisting = await listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted");
    console.log(deletedlisting);

    res.redirect("/listings");
};

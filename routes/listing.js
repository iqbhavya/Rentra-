const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require("../controllers/listings.js")

// Index Route and Create Route

router.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    validateListing, 
    wrapAsync(listingController.createListing)
);

// New Route

router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show, Update and Delete Route

router.route("/:id")
.get( wrapAsync(listingController.showListings))
.patch( isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete( isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);

//Edit Route

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
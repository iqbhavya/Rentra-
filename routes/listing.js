const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")

const listingController = require("../controllers/listings.js")

// Index Route

router.get('/', wrapAsync(listingController.index));

// New Route

router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show Route
router.get("/:id", wrapAsync(listingController.showListings));

// Create Route 

router.post('/', isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Edit Route

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


router.patch('/:id', isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



module.exports = router;
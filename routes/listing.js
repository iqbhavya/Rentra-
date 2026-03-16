const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require('../models/listing');

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    };
}

router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });
    
}));

router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let id = req.params.id;
    const listing =await Listing.findById(id).populate("reviews");
    res.render('listings/show.ejs', { listing: listing });
    
}));

// Create Route 

router.post('/',validateListing,  wrapAsync (async(req, res, next) => {
    
        const { title, description, price, location, country } = req.body.listing;
        const newListing = new Listing({
        title,
        description,
        price,
        location,
        country
    });
    await newListing.save();
    res.redirect('/listings');
    })
);

//Edit Route

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));


router.patch('/:id',validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    const { title, description, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
    res.redirect(`/listings/${id}`);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));



module.exports = router;
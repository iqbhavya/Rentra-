const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../Utils/wrapAsync.js");
const {  reviewSchema } = require("../schema.js");
const ExpressError = require("../Utils/ExpressError.js");
const Listing = require('../models/listing');

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    };
}

// Review route

// Post Review Route

router.post("/", validateReview, wrapAsync(async (req,res,next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route

router.delete("/:reviewId", wrapAsync(async(req,res,next) => {
    let {id , reviewId} = req.params;

    
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`)
}));

module.exports = router;
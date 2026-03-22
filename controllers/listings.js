const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });

};

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs');
};

module.exports.showListings = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    console.log(listing.reviews);
    if(!listing){
        req.flash("error", "Listing you requested doesn't exist");
        res.redirect('/listings');
        console.log("error got")

    } else{
        res.render('listings/show.ejs', { listing: listing });
    }

};

module.exports.createListing = async (req, res, next) => {

    const { title, image, description, price, location, country } = req.body.listing;
    const newListing = new Listing({
        title,
        image:{ url: image, filename: "" },
        description,
        price,
        location,
        country
    });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    // 🔥 fix image before update
    if (req.body.listing.image && req.body.listing.image.trim() !== "") {
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: ""
        };
    } else {
        delete req.body.listing.image;
    }

    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
};
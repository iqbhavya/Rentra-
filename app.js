const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./Utils/wrapAsync.js");
const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

main().then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error:', err);
});
async function main(){
    await mongoose.connect('mongodb://localhost:27017/rentra');
    console.log('Connected to MongoDB');
}


app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hi I am Root');
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    };
}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else {
        next();
    };
}

app.get('/listings', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });
    
}));

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let id = req.params.id;
    const listing =await Listing.findById(id).populate("reviews");
    res.render('listings/show.ejs', { listing: listing });
    
}));

// Create Route 

app.post('/listings',validateListing,  wrapAsync (async(req, res, next) => {
    
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

app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));


app.patch('/listings/:id',validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    
    const { title, description, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
    res.redirect(`/listings/${id}`);
}));

app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// Review route

// Post Review Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res,next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res,next) => {
    let {id , reviewId} = req.params;

    
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}));


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { err });
    
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
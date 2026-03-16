const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const ExpressError = require("./Utils/ExpressError.js");

const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);



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
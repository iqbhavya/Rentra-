const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');




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
    res.send('Hello World!');
});

app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });
    
});

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

app.get("/listings/:id",async (req, res) => {
    let id = req.params.id;
    const listing =await Listing.findById(id);
    res.render('listings/show.ejs', { listing: listing });
    
});

app.post('/listings', async (req, res) => {
    const { title, description, price, location, country } = req.body;
    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country
    });
    await newListing.save();
    res.redirect('/listings');
});

//Edit Route

app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});

app.patch('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
    res.redirect(`/listings/${id}`);
});

app.delete('/listings/:id', async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
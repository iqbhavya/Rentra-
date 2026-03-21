const mongoose = require('mongoose');
const initData = require('./data.js');

const Listing = require('../models/listing');

const MongoURL = 'mongodb://localhost:27017/rentra';

main().then(() => {
    console.log('Database connection successful');
    
}).catch(err => {
    console.error('Database connection error:', err);
});

async function main(){
    await mongoose.connect(MongoURL);
    console.log('Connected to MongoDB');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"69be5e00548ed643f3a857c3"}));
    await Listing.insertMany(initData.data);
    console.log('Database seeded successfully');
}

initDB();
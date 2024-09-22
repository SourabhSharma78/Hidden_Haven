const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// const dbUrl = process.env.ATLASDB_URL;



main().then(() => {
    console.log("connected successfully");
}).catch(err => {
    console.log("could not connect to the database: " + err);
})

// async function main(){
//     await mongoose.connect();
// } 

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner : "66e9b4ac4c4b72008d1278f8"}));
    await Listing.insertMany(initData.data);
    console.log("data iniatialized successfully ");
};


// initDB();
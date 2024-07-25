const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require('./models/listing.js');
const mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

main().then(() => {
    console.log("db connected successfully");
}).catch(err => {
    console.log("could not connect to the database: " + err);
})

async function main(){
    await mongoose.connect(`${mongo_URL}`);
} 

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "public")));

app.get("/", (req,res) => {
    res.send("hi I am groot.");
});



//index route 
app.get("/listings" , async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs"  , {allListings});
});

//new route 
app.get("/listings/new" , (req,res) => {
    res.render("listings/new.ejs");
});

//show route 
app.get("/listings/:id", async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , { listing });
});

// create route 
app.post("/listings" , async (req,res) => {
   let newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

//edit route 
app.get("/listings/:id/edit" , async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});

//update route 
app.put("/listings/:id" , async(req , res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id , updatedListing);
    res.redirect("/listings");
});

//delete route 
app.delete("/listings/:id" , async( req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


app.listen(`${port}`, () => {
    console.log(`Server is running on port ${port}`);
});
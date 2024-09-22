const Listing = require('../models/listing');

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs"  , {allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async(req,res) => {
    let { id } = req.params;
   try{
    const listing = await Listing.findById(id).populate({path : "reviews" , populate :{path : "author"} }).populate("owner"); // when a refrence to an object  is stored in a schema we need to use populate() method to fetch its content from refrence table .
    if(!listing){
        req.flash("error","listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs" , { listing });
   }
   catch (error) {
    req.flash("error", "An error occurred while fetching the listing.");
    console.error(error); // Log the error for debugging
    return res.redirect("/listings");
}
    
};

module.exports.createListing = async (req,res,next) => {
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New listing added successfully");
    res.redirect("/listings");
 };

 module.exports.editListing = async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
};

module.exports.updateListing = async (req, res) => {
   try{
    const { id } = req.params;
    
    // Update the listing and return the updated document
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing},{new:true});
    // console.log(listing);
    // console.log(req.body);
    // console.log(req.file);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success","Listing Updated Successfully.");
    res.redirect("/listings");
   }
   catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while updating the listing.");
    res.redirect("/listings");
}
};

  module.exports.destroyListing = async( req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
};


const Review = require('../models/review');
const Listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res) => {
    let { id , reviewId } = req.params;
    await Listing.findByIdAndUpdate(id , {$pull : {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};
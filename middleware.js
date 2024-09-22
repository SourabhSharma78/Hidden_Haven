const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema , reviewSchema} = require("./schema.js");
const review = require("./models/review.js");



module.exports.isLoggedIn = (req,res,next) => {
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.oroiginalUrl;
        req.flash("error","Please Login to access this field");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    const updatedListing = req.body.listing;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    // Validate the incoming request body against the schema
    const { error } = listingSchema.validate(req.body);

    // Check if there is a validation error
    if (error) {
        const errmsg = error.details.map((el) => el.message).join(", ");
        return res.status(400).json({ error: errmsg }); // Send a JSON response with the error
    }

    next(); // Proceed to the next middleware/route handler if validation passes
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(req.body);
    if (error && error.details) {
        const errmsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
   
};

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized for this action ");
        return res.redirect(`/listings/${id}`);
    }

    next();
}


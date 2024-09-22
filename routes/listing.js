
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const {listingSchema , reviewSchema} = require("../schema.js");
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');
const listingController = require('../controller/listing.js');
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });



//index route 
router.get("/" , wrapAsync(listingController.index));

//new route 
router.get("/new" , isLoggedIn , listingController.renderNewForm);

//show route 
router.get("/:id", wrapAsync(listingController.showListings));

// create route 
router.post("/" , isLoggedIn, upload.single('listing[image]') ,  wrapAsync(listingController.createListing));


//edit route 
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingController.editListing));

//update route 
router.put("/:id/edit", isLoggedIn,isOwner, upload.single('listing[image]') ,validateListing, wrapAsync(listingController.updateListing));

//delete route 
router.delete("/:id" , isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));





module.exports = router;
const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const ExpressError = require("../utils/ExpressError.js");
const User = require('../models/User.js');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require('../controller/user.js');

router.get("/signup" , userController.renderSignupForm);

router.post("/signup", userController.userRegister);

router.get("/login",userController.renderLogin);

router.post("/login", saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login" ,failureFlash: true}) ,userController.loginUser);

router.get("/logout", userController.logoutUser);


module.exports = router;
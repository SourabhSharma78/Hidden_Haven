const User = require("../models/User");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};



module.exports.userRegister = async (req, res) => {
    
  try {
    let { username, password, email } = req.body;
    console.log(username);
    const newuser = new User({ email, username });
    console.log(newuser);
    const registeredUser = await User.register(newuser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        console.log("error here ", err);
        return next(err);
      }
      req.flash("success", "Welcome to HidenHaven");
      res.redirect("/listings");
    });
  } catch (err) {
    console.log("catch err",err);
    req.flash("error", err.message);
    res.redirect("/users/signup.ejs");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back to HiddenHaven");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully !!!");
    res.redirect("/listings");
  });
};

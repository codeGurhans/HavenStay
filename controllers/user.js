const User = require("../models/user.js");

module.exports.signup_post = async(req, res) => {
    let{username, email, password} = req.body;
    let newUser = new User({username, email});
    let registered_user = await User.register(newUser, password);
    req.login(registered_user, (err) => {
        if(err)
        {
            return next(err);
        }    
        req.flash("new_listing", "Welcome to AIRBNB.com!");
        res.redirect("/listings"); 
    });
}

module.exports.login_post = async(req, res) => {   
    req.flash("new_listing", "Welcome back to AIRBNB.com!");
    res.redirect("/listings"); 
} 

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err)
        {
            return next(err);
        }
        req.flash("new_listing", "You are logged out!");
        res.redirect("/listings");
    }); 
}


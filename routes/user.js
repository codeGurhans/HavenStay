const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controllers/user.js");

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

router.post("/signup", asyncWrap(userController.signup_post));

router.get("/login", (req, res) => {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate('local', {failureRedirect: "/login", failureFlash: true}),
    asyncWrap(userController.login_post));

router.get("/logout", userController.logout);

module.exports = router;
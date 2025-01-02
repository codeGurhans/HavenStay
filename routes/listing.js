const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const listingController = require("../controllers/listing.js");

// Privacy page
router.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
})

// Terms page
router.get("/terms", (req, res) => {
    res.render("terms&con.ejs");
})

router.get("/terms", (req, res) => {
    res.render("terms&con.ejs");
})

router.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
})

// Creates a new form for listing
router.get("/new", listingController.new_listing_form);    

//DETAILED LISTING
router.get("/:id", asyncWrap(listingController.detailed_listing));

// INDEX ROUTE
router.get("/", asyncWrap(listingController.index_route));    

// Adds the Listing with all the parameters
router.post("/", asyncWrap(listingController.adds_listing));    

// Opens an edit form
router.get("/:id/edit", asyncWrap(listingController.edit_form));    

// Saves all the updations and redirects to the home page
router.put("/:id", asyncWrap(listingController.updates_changes));   

// Deletes a created Listing
router.delete("/:id", asyncWrap(listingController.delete_listing));    

module.exports = router;
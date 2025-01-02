const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrap = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/review.js");

// POST ROUTE for Reviews
router.post("/", asyncWrap(reviewController.post_review));

// DELETE route for comments
router.delete("/:reviewId", asyncWrap(reviewController.delete_review));

module.exports = router;


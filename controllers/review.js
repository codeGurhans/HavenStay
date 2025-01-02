const Review = require("../models/review.js");
const Listing = require("../models/listing");

module.exports.post_review = async(req, res) => {
    if(!req.isAuthenticated())
        {
            req.flash("error", "You must be logged in to do the respective task");
            res.redirect("/login");
        }
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review({comment: req.body.comment, rating: req.body.rating});
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("new_listing", "Review added!");
    res.redirect(`/listings/${id}`);
}

module.exports.delete_review = async(req, res) => {
    if(!req.isAuthenticated())
        {
            req.flash("error", "You must be logged in to do the respective task");
            res.redirect("/login");
        }
   let{id, reviewId} = req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("new_listing", "Review deleted!");
   res.redirect(`/listings/${id}`);
}
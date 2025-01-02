const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const map_token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: map_token});

module.exports.index_route = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", {allListings});
}

module.exports.new_listing_form = (req, res) => {
    if(!req.isAuthenticated())
    {
        req.flash("error", "You must be logged in to do the respective task");
        res.redirect("/login");
    }
    res.render("addList.ejs");
}

module.exports.detailed_listing = async (req, res) => {
    let { id } = req.params;
    const specific_listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })  // Ensure author is populated
        .populate("owner");  // Ensure owner is populated
    res.render("read.ejs", { specific_listing });
}

module.exports.adds_listing = async (req, res, next) => {
    let {title, description, image, price, location, country} = req.body; 
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
      })
      .send();

    let newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    });    
    if(!req.body.title || !req.body.description ||!req.body.price || 
        !req.body.location || !req.body.country
    )    
    {
        throw new ExpressError(400, "Bad Request");
    }    
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("new_listing", "New listing added!");
    res.redirect("/listings");
}

module.exports.edit_form = async (req, res) => {
    if(!req.isAuthenticated())
        {
            req.flash("error", "You must be logged in to do the respective task");
            res.redirect("/login");
        }
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", {listing});
}

module.exports.updates_changes = async (req, res) => {
    let {id} = req.params;
    let {title, description, image, price, location, country} = req.body; 
    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
        title: title,    
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
        },
        {new: true},
    );     
    req.flash("new_listing", "Listing updated!");    
   res.redirect("/listings"); 
}

module.exports.delete_listing = async (req, res) => {
    if(!req.isAuthenticated())
        {
            req.flash("error", "You must be logged in to do the respective task");
            res.redirect("/login");
        }
    let { id } = req.params;
    let deletedChat = await Listing.findByIdAndDelete(id);
    req.flash("new_listing", "Listing deleted!");
    res.redirect("/listings");
}



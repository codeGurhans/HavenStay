const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: "https://unsplash.com/photos/a-beach-with-palm-trees-and-a-sunset-2YjUoTdqD1s",
        set: (v) => v === "" ? 
        "https://unsplash.com/photos/a-beach-with-palm-trees-and-a-sunset-2YjUoTdqD1s": v,
    },
    price:{
        type: Number,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    country:{
        type: String,
        required: true,
    },
     
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"        
    },
    
    geometry:{
          type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
    },  
  });

listingSchema.post("findOneAndDelete", async(listing) => {
        await Review.deleteMany({_id: {$in: listing.reviews}});
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
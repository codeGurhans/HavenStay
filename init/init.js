const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/AIRBNB_S');
}

async function initDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "676ff677d0ff0bb19ca9fd5f"}));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();




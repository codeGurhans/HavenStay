require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js")
const session = require("express-session");
const mongo_store = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const local_strategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

const store = mongo_store.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
       secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: "false",
    saveUninitialized: "true",
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.new_listing = req.flash("new_listing");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

// For any other page we search
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
   res.status(statusCode).render("errorShow.ejs", {message});
});

app.listen(8080, (req, res) => {
    console.log("Server: 8080");
})
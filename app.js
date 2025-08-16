// Import required modules
require('dotenv').config();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // load from .env
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


let dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter: 24*60*60

})
store.on("error", ()=>{
  console.log("error in mongoose store:",err);
})
// Session configuration options
const sessionOptions = {
  store,
  secret: process.env.SECRET, // Secret for signing the session ID cookie
  resave: false,           // Do not save session if unmodified
  saveUninitialized: true, // Save new sessions even if they are not modified
  cookies: {               // Cookie settings
    expire: Date.now() * 7 * 24 * 60 * 60 * 1000, // Expiration time
    maxAge: 7 * 24 * 60 * 60 * 1000,              // Max age in ms (7 days)
    httpOnly: true                                // Cookie not accessible via JavaScript
  }
};

// Session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Using local strategy
passport.serializeUser(User.serializeUser());         // Store user in session
passport.deserializeUser(User.deserializeUser());     // Retrieve user from session



// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch(err => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

// Set EJS as view engine with ejs-mate for layouts/partials
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(cookieparser("secretcode"));                     // Parse cookies
app.use(express.urlencoded({ extended: true }));         // Parse URL-encoded form data
app.use(methodOverride("_method"));                      // Support PUT/DELETE from forms
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Custom middleware to make flash messages & user data available in views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;           // Store current user
  res.locals.redirecturl = req.originalUrl; // Store original requested URL
  next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Handle all unmatched routes
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start the server
app.listen(8080, () => {
  console.log("server listening on port 8080");
});

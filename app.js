// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError")
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");


const sessionOptions = {
  secret:"mysupersecret",
  resave:false,
  saveUninitialized:true,
  cookies:{
    expire:Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}

// Root route
app.get("/", (req, res) => {
  res.send("root is working");
});



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection URL
const mongoose_url = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch(err => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoose_url);
}

// Set EJS as view engine with ejs-mate for layouts/partials
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(cookieparser("secretcode"));
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method"));              // Support PUT/DELETE via query param
app.use(express.static(path.join(__dirname, "public"))); // Serve static assets
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all(/.*/,(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
})

// Start the server
app.listen(8080, () => {
  console.log("server listening on port 8080");
});

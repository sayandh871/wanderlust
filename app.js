// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utils/ExpressError")
const listings = require("./routes/listing");
const reviews = require("./routes/review");

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
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method"));              // Support PUT/DELETE via query param
app.use(express.static(path.join(__dirname, "public"))); // Serve static assets

// Root route
app.get("/", (req, res) => {
  res.send("root is working");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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

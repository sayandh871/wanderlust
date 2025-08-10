const listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError")
const {listingschema,reviewSchema}=require("./schema")


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
       req.session.redirecturl = req.originalUrl; 
    req.flash("error","you must be logged in to create listings");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveredirecturl = (req, res, next) => {
    if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","you dont have permission for this");
    return res.redirect("/listings");
  }
  next();
}

module.exports.validatelisting = (req,res,next) => {
  let {error} = listingschema.validate(req.body);  
  if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,error);      
  }else{
    next();
  }
}

module.exports.validatereview = (req,res,next) => {
  let {error} = reviewSchema.validate(req.body);  
  if(error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,error);      
  }else{
    next();
  }
}
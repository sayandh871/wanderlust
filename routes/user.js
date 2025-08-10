const express = require("express");
const router = express.Router({mergeParams:true});
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapasync(async(req, res) => {
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err) => {
        if(err){
            return next();
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})
router.post(
    "/login",
    saveredirecturl,
    passport.authenticate("local",
        {failureRedirect:"/login",
        failureFlash:true
    }),
    async(req, res) => {
        req.flash("success","Welcome back to Wanderlust");
        let redirecturl = res.locals.redirecturl || "/listings";
        res.redirect(redirecturl);
})

router.get("/logout",(req, res, next) => {
    req.logOut((err) => {
        if(err){
            return next();

        }
        req.flash("success","you are loged out");
        res.redirect("listings");
    });
})


module.exports = router;
const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");
const userController = require("../controllers/users")

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapasync(userController.singUp));


router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveredirecturl,
    passport.authenticate("local",
        {failureRedirect:"/login",
        failureFlash:true
    }),userController.login);

router.get("/logout",userController.logout)


module.exports = router;
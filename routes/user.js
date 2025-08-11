const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");
const userController = require("../controllers/users")

router.get("/signup", userController.renderSignUpForm)

router.post("/signup", wrapasync(userController.singUp));


router.get("/login",userController.renderLoginForm)
router.post(
    "/login",
    saveredirecturl,
    passport.authenticate("local",
        {failureRedirect:"/login",
        failureFlash:true
    }),userController.login);

router.get("/logout",userController.logout)


module.exports = router;
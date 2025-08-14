const User = require("../models/user");

/**
 * Render the sign-up form
 */
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

/**
 * Handle user registration
 */
module.exports.singUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        // Create a new User instance (username & email only)
        const newUser = new User({ email, username });

        // Register the user with hashed password
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        // Automatically log the user in after successful signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next();
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

/**
 * Render the login form
 */
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

/**
 * Handle login and redirect to the intended URL or listings page
 */
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirecturl = res.locals.redirectUrl || "/listings";
    delete res.locals.reiderectUrl;
    return res.redirect(redirecturl);
};

/**
 * Handle user logout
 */
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next();
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
};

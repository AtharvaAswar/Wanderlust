const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../public/util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// new user registration
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registredUser = await User.register(newUser, password);
        console.log(registredUser);
        req.login(registredUser, (err, next) => {
            if (err) {
                console.log(err.message);
                req.flash("error", "login failed");
                return next(err);
            } else {
                req.flash("success", "Registration successfull");
                res.redirect("/listings");
            }
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})
);

// sign-in form
router.get("/login", (req, res) => {
    res.render("users/signin.ejs");
});

// sign-in
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    req.flash("success", "welcome back");
    console.log(`logged in as ${req.user.username}`);

    let URL = res.locals.redirectUrl || "/listings";
    res.redirect(URL);
});

// logout
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            console.log(err.message);
            req.flash("error", "some error occured");
            return next(err);
        }
        req.flash("success", "logged out");
        res.redirect("/login");
    });
});

module.exports = router;
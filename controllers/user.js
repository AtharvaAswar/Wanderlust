const User = require("../models/user.js");

module.exports.signUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
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
}

module.exports.signInForm = (req, res) => {
    res.render("users/signin.ejs");
}

module.exports.signIn = async (req, res) => {
    req.flash("success", "welcome back");
    console.log(`logged in as ${req.user.username}`);
    let URL = res.locals.redirectUrl || "/listings";
    res.redirect(URL);
}

module.exports.signOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            console.log(err.message);
            req.flash("error", "some error occured");
            return next(err);
        }
        req.flash("success", "logged out");
        res.redirect("/login");
    });
}

module.exports.policy = (req, res, next) => {
    res.render("policy.ejs");
}

module.exports.terms = (req, res, next) => {
    res.render("terms.ejs");
}
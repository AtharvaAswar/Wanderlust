const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controller = require("../controllers/user.js")

router.route("/signup")
    .get(controller.signUpForm)
    .post(wrapAsync(controller.signUp));

router.route("/login")
    .get(controller.signInForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), controller.signIn);

router.get("/logout", controller.signOut);

module.exports = router;
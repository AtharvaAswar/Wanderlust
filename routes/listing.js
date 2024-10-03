const express = require("express");
const router = express.Router();
const ExpressError = require("../public/util/expressError.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../public/util/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middleware.js");

//Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
})
);

//New route
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user.username);
    res.render("listings/new.ejs");
});

//Create route
router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res) => {
    // Process the form data to ensure the image object is correctly structured
    const listingData = {
        title: req.body.listing.title,
        description: req.body.listing.description,
        image: {
            filename: req.body.listing.image.filename,
            url: req.body.listing.image.url
        },
        owner: req.user._id,
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country
    };

    const newListing = new Listing(listingData);
    await newListing.save();
    req.flash("success", "new hotel added !");
    res.redirect(`/listings`);

})
);

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!data) {
        req.flash("error", "hotel doesn`t exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { data });
    }
})
);

//Edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "hotel doesn`t exist");
        res.redirect("/listings");
    } else {
        res.render("listings/edit.ejs", { data });
    }
})
);

//Update route
router.put("/:id", isLoggedIn, validateListing, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid listing");
    }
    // Process the form data to ensure the image object is correctly structured
    const listingData = {
        title: req.body.listing.title,
        description: req.body.listing.description,
        image: {
            filename: req.body.listing.image.filename,
            url: req.body.listing.image.url
        },
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country
    };

    await Listing.findByIdAndUpdate(id, listingData, { new: true });
    req.flash("success", "updated successfully !");
    res.redirect(`/listings/${id}`);
})
);


//Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    req.flash("success", "hotel removed successfully !")
    res.redirect("/listings");
})
);

module.exports = router;
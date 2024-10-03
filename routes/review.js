const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../public/util/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");

//Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "review added !");
    res.redirect(`/listings/${req.params.id}`);
})
);

//Delete route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {

    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("Deleted");
    req.flash("success", "review deleted !");
    res.redirect(`/listings/${id}`);
})
);

module.exports = router;
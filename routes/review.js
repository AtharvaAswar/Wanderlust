const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../public/util/wrapAsync.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const controller = require("../controllers/review.js");

//Post route
router.post("/", isLoggedIn, validateReview, wrapAsync(controller.createReview));

//Delete route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(controller.destroyReview));

module.exports = router;
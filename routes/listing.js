const express = require("express");
const router = express.Router();
const wrapAsync = require("../public/util/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner, upload } = require("../middleware.js");
const controller = require("../controllers/listing.js");

router.route("/")
    .get(wrapAsync(controller.index))
    .post(isLoggedIn, upload, validateListing, wrapAsync(controller.addListing));

//New route
router.get("/search", controller.search);
router.get("/new", isLoggedIn, controller.newListingForm);


router.route("/:id")
    .get(wrapAsync(controller.show))
    .put(isLoggedIn, isOwner, upload, validateListing, wrapAsync(controller.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(controller.destroy));

//Edit form route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(controller.editListingForm));

module.exports = router;
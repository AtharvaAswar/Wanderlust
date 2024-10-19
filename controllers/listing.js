const ExpressError = require("../public/util/expressError.js");
const Listing = require("../models/listing.js");
const { getCoordinates } = require('../public/util/getCoordinates.js');

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
}

module.exports.newListingForm = (req, res) => {
    console.log(req.user.username);
    res.render("listings/new.ejs");
}

module.exports.addListing = async (req, res) => {
    console.log(req.body);
    const listingData = {
        title: req.body.listing.title,
        description: req.body.listing.description,
        owner: req.user._id,
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country,
        speciality: req.body.listing.speciality
    };
    function addData() {
        newListing.image.filename = req.file.filename;
        newListing.image.url = req.file.path;
        newListing.coordinates = [Geocoordinates.latitude, Geocoordinates.longitude];
    };

    const newListing = new Listing(listingData);
    const Geocoordinates = await getCoordinates(listingData.location);
    addData();
    await newListing.save();
    req.flash("success", "new hotel added !");
    res.redirect(`/listings`);

}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!data) {
        req.flash("error", "hotel doesn`t exist");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { data, apiKey: process.env.MAP_API_KEY });
    }
}

module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    let OgUrl = data.image.url;
    OgUrl = OgUrl.replace("/uploads", "/uploads/w_200");
    if (!data) {
        req.flash("error", "hotel doesn`t exist");
        res.redirect("/listings");
    } else {
        res.render("listings/edit.ejs", { data, addr: OgUrl });
    }
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid listing");
    }

    const Geocoordinates = await getCoordinates(req.body.listing.location);
    // Process the form data to ensure the image object is correctly structured
    const listingData = {
        title: req.body.listing.title,
        description: req.body.listing.description,
        price: req.body.listing.price,
        location: req.body.listing.location,
        country: req.body.listing.country,
        coordinates: [Geocoordinates.latitude, Geocoordinates.longitude]
    };
    if (typeof req.file !== "undefined") {
        listingData.image = {
            filename: req.file.filename,
            url: req.file.path
        }
    }

    await Listing.findByIdAndUpdate(id, listingData, { new: true });
    req.flash("success", "updated successfully !");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    req.flash("success", "hotel removed successfully !")
    res.redirect("/listings");
}

module.exports.search = async (req, res) => {
    let val = req.query.city;
    const allListing = await Listing.find({ location: val });
    if (allListing.length > 0) {
        res.render("listings/index.ejs", { allListing });
    } else {
        req.flash("error", "No Airbnb found here!");
        res.redirect("/listings");
    }

}
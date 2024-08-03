const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const asyncWrap = require("./public/util/wrapAsync.js");
const ExpressError = require("./public/util/expressError.js");
const wrapAsync = require("./public/util/wrapAsync.js");
const { listingSchema } = require("./schema.js");
const expressError = require("./public/util/expressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);
main()
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

function chkValid(req, res, next) {
    let { error } = listingSchema.validate(req.body);
    let errMsg = error.details.map(el => el.message).join(",");
    if (error) {
        throw new expressError(400, errMsg);
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    console.log("req recieved");
    res.render("listings/home.ejs");
});

//Index route
app.get("/listing", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
})
);

//New route
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Create route
app.post("/listings", chkValid, asyncWrap(async (req, res, next) => {
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

    const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);

})
);


//Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id);
    res.render("listings/show.ejs", { data });
})
);

//Edit form route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    res.render("listings/edit.ejs", { data });
})
);

//Update route
app.put("/listings/:id", chkValid, wrapAsync(async (req, res) => {
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
    res.redirect(`/listings/${id}`);
})
);



//Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    res.redirect("/listing");
})
);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    res.render("error.ejs", { err });
})

app.listen(port, () => {
    console.log("app is listening on port 8080");
});


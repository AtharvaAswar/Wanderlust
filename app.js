if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./public/util/expressError.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const { error } = require("console");

const dbUrl = process.env.ATLAS_DB_URL;
const secretTxt = process.env.SECRET;

main()
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.log(err);
    });

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secretTxt
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", () => {
    console.log("Error in Mongo Session", error);
});

const sessionOptions = {
    store,
    secret: secretTxt,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 2 * 24 * 60 * 60 * 1000,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.engine("ejs", ejsMate);
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main() {
    await mongoose.connect(dbUrl);
}

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

app.all("*", (req, res, next) => next(new ExpressError(404, "page not found")));

app.use((err, req, res, next) => res.render("error.ejs", { err }));

app.listen(port, () => console.log("app is listening on port 8080"));


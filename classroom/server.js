const express = require("express");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const sessionOptions = {
    secret: "secretstring",
    resave: false,
    saveUninitialized: true
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(cookieParser("code"));
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});
// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(req.session.count + " times");
// });

app.get("/register", (req, res) => {
    let { name = "User" } = req.query;
    req.session.name = name;
    if (name == "User") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully");
    }
    res.redirect("/hi");
});

app.get("/hi", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
})

// app.get("/test", (req, res) => {
//     res.send("Test successful");
// });

// app.get("/", (req, res) => {
//     const txt = req.cookies;
//     console.log(txt);
//     res.send(txt);
// });

// app.get("/getcookie", (req, res) => {
//     res.cookie("greet", "Namaskar");
//     res.send("Sending cookies");
// });

// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("color", "Green", { signed: true });
//     res.send("Sending cookies");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/", (req, res) => {
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);



app.listen(3000, () => {
    console.log("server is listening to 3000");
});
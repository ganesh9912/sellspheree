if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listings.js");
const User = require("./models/user.js");

// ROUTES
const userRoutes = require("./routes/user.js");
const listingRoutes = require("./routes/listing.js");
const cartRoutes = require("./routes/cart.js");
const paymentRoutes = require("./routes/payment");

const ExpressError = require("./utils/ExpressError.js");

const dbUrl = process.env.ATLASDB_URL;

// DB CONNECTION
main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log("DB error:", err));

async function main() {
    await mongoose.connect(dbUrl);
}

// EJS + STATIC
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// SESSION STORE
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR", err);
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, // important to avoid unnecessary sessions
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));

app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// HOME
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ROUTES
app.use("/cart", cartRoutes);
app.use("/", listingRoutes);
app.use("/", userRoutes);
app.use("/payment", paymentRoutes);

// 404 & ERROR HANDLER
app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found!")));
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// START SERVER
app.listen(8080, () => console.log("Server is listening on port 8080"));

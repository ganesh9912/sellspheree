const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { SaveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get("/signup", userController.renderSignupForm)

router.post("/signup", userController.signUpForm)

router.get("/login", userController.renderLoginForm);

router.post("/login", 
    SaveRedirectUrl, 
    passport.authenticate("local", { 
        failureRedirect: "/login", 
        failureFlash: true 
    }), 
    
    userController.LoginForm
);

router.get("/logout", userController.LogOutForm)

module.exports = router;
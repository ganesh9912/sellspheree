const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) =>{
    res.render("users/signup.ejs");
}


module.exports.signUpForm = async(req,res) =>{
    try{
        const { username, email, password } = req.body;

        const newUser = new User({email,username});
       const registeredUser = await User.register(newUser, password);
       console.log(registeredUser);
       req.login(registeredUser, (err) =>{
        if (err) {
            return next(err);
        }
        req.flash("success","user was registered sucessfully");
        res.redirect("/listings"); 
       })
     
    }

    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs")
}

module.exports.LoginForm= async (req, res) => {
        
    req.flash("success", "Welcome to Wanderlust!"); // Fixed flash message key
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    
    
}


module.exports.LogOutForm = (req,res) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}
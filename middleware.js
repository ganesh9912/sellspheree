const Listing = require("./models/listings");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

isLoggedIn= (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listings");
        return res.redirect("/login");
    }
    next();
}

const SaveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) { // Check if the redirectUrl exists
        res.locals.redirectUrl = req.session.redirectUrl; // Make it available for redirection
    }
    next(); // Proceed to the next middleware or route handler
};

 isOwner =  async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You dont have permission for this");
       return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports = { isLoggedIn, SaveRedirectUrl, isOwner};
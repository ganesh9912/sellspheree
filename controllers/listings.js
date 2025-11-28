const Listing = require("../models/listings.js");
const {listingSchema} = require("../schema.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage})
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", {allListings});
 }

 module.exports.renderNewForm = (req,res) => {
    res.render("./create.ejs");
};


module.exports.showListing = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("show.ejs", { listing, currentUser: req.user }); // <-- pass currentUser here
}

module.exports.renderPurchasePage = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("purchase.ejs", { listing, currentUser: req.user });
}

module.exports.confirmPurchase = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Here you can integrate payment gateway or mark as purchased
    req.flash("success", `You have successfully purchased ${listing.title}`);
    res.redirect("/listings");
}


module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
     .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    let url = req.file.path;
   let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename};
    newListing.geometry=response.body.features[0].geometry; 
    let savedListing = await newListing.save();
     console.log(savedListing);
    req.flash("success", "New Listing Created");
     res.redirect("/listings");
  }

  module.exports.searchFunction = async (req, res) => {
    try {
        let { id } = req.query;
        
        console.log("Received ID:", id);

        if (!id) {
            req.flash("error", "listing not found");
            return res.redirect("/listings"); // Redirect to listings page or another page
        }

        let listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found.");
            return res.redirect("/listings"); // Redirect back if not found
        }

        console.log("Found Listing:", listing);
        res.render("show.ejs", { listing });

    } catch (error) {  // Catch any unexpected errors
        console.error("Error fetching listing:", error);
        req.flash("error", "Listing not found");
        res.redirect("/listings");
    }
}


  module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested doesnot exist");
        res.redirect("/listings");
    }
    res.render("edit.ejs", {listing});
}

module.exports.updateListings = async (req, res) => {
    let { id } = req.params;
    
    try {
        // Find and update the listing
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
        
        // If a file is uploaded, update the image field
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }
        
        // Flash a success message and redirect
        req.flash("success", "Listing is updated successfully");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        // Handle any errors
        console.error("Error updating listing:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect(`/listings/${id}`);
    }
}


module.exports.destroyListings = async (req,res) => {
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success","Listing deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}



module.exports.hello = (req, res) => {
    let hi = "hello";
    res.send("Hello, world!");
    console.log(hi);
};


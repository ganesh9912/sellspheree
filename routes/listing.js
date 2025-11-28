const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner  } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage})


router.get("/testing" , async(req, res) => {
    try{
    const sampleListing = new Listing({
        title:"My New Villa",
        description:"Beach",
        price:"10000000",
        location:"Hyderabad",
        country:"India",
        
    })
    await sampleListing.save();
    console.log(sampleListing);
    res.send("Sucessful testing");
}
catch(err){
    res.send("the app is not working");
}

});

//Show Route
router.get("/listings",wrapAsync(listingController.index));
 
router.get("/listings/helloe", listingController.hello);
router.get("/listings/search", listingController.searchFunction);


 router.get("/listings/:id",wrapAsync(listingController.showListing));

router.get("/create", isLoggedIn, wrapAsync(listingController.renderNewForm));

router.post("/listings", isLoggedIn,upload.single('listing[image]'),
listingController.createListing,
  );
  

// Buy Now page
router.get("/purchase/:id", isLoggedIn, wrapAsync(listingController.renderPurchasePage));

// Handle purchase confirmation (optional)
router.post("/purchase/:id", isLoggedIn, wrapAsync(listingController.confirmPurchase));

router.get("/listings/:id/edit", isLoggedIn,wrapAsync(listingController.renderEditForm)
);

router.put("/listings/:id", isLoggedIn,isOwner,upload.single('listing[image]'),listingController.updateListings
);
 
router.delete("/listings/:id", isLoggedIn,isOwner,listingController.destroyListings
);








module.exports = router;


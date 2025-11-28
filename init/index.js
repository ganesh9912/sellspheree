const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const mongo_url = "mongodb+srv://gani:4XcQGfhv9Ih71QY5@cluster0.cacaj.mongodb.net/test?retryWrites=true&w=majority";

const main = async ()=>  {
    await mongoose.connect(mongo_url);
   }
   
main()
.then(() => {
    console.log("connected to db");
})
 .catch((err) => {
    console.log("error");
})



const initDB = async () => {
    await Listing.deleteMany({}); // Clear existing data

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "67a449f5f77031ba93c531b0", // Assign a default owner ID
        geometry: obj.geometry || { 
            type: "Point", 
            coordinates: [74.0060, 40.7128] // Default coordinates (update this if necessary)
        }
    }));

    await Listing.insertMany(initData.data);
    console.log(" Data was initialized successfully!");
};


initDB();

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            listing: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing",   // IMPORTANT (must match your model name)
                required: true
            },
            qty: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);

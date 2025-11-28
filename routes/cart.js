const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");
const { isLoggedIn } = require("../middleware");

// Show cart
router.get("/show", isLoggedIn, cartController.showCart);

// Add item
router.post("/add/:id", isLoggedIn, cartController.addToCart);

// Remove item
router.post("/remove/:id", isLoggedIn, cartController.removeFromCart);

// Buy all items
router.post("/purchase/cart", isLoggedIn, cartController.purchaseCart);

module.exports = router;

const Listing = require("../models/listings");

// Show cart
module.exports.showCart = (req, res) => {
    const cart = req.session.cart || [];

    // Calculate total price
    const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

    res.render("cart/show", { cartItems: cart, totalPrice });
};

// Add item to cart
module.exports.addToCart = async (req, res) => {
    try {
        const id = req.params.id;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Item not found!");
            return res.redirect("back");
        }

        if (!req.session.cart) req.session.cart = [];

        req.session.cart.push({
            id: listing._id,
            name: listing.title,
            price: listing.price,
            image: listing.image?.url || "/images/default.jpg",
        });

        req.flash("success", "Item added to cart!");
        res.redirect("/cart/show");
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("back");
    }
};

// Remove item from cart
module.exports.removeFromCart = (req, res) => {
    const id = req.params.id;

    if (!req.session.cart) req.session.cart = [];

    req.session.cart = req.session.cart.filter(item => item.id != id);

    req.flash("success", "Item removed from cart!");
    res.redirect("/cart/show");
};

// Purchase all items in cart
module.exports.purchaseCart = (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        req.flash("error", "Your cart is empty!");
        return res.redirect("/cart/show");
    }

    // You can integrate payment gateway logic here
    cart.forEach(item => {
        console.log(`Purchased: ${item.name} - $${item.price}`);
    });

    req.session.cart = []; // clear cart after purchase
    req.flash("success", "All items purchased successfully!");
    res.redirect("/listings");
};

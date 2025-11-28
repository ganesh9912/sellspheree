const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { isLoggedIn } = require("../middleware");

// Create Stripe checkout session
router.post("/create-checkout-session", isLoggedIn, async (req, res) => {
    const totalPrice = req.body.totalPrice;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: { name: "Cart Purchase" },
                        unit_amount: totalPrice * 100, // in paise
                    },
                    quantity: 1,
                },
            ],
            // Stripe redirects here after payment
            success_url: `${req.protocol}://${req.get("host")}/payment/success`,
            cancel_url: `${req.protocol}://${req.get("host")}/cart/show`,
        });

        res.redirect(303, session.url);
    } catch (err) {
        console.log(err);
        req.flash("error", "Payment failed!");
        res.redirect("/cart/show");
    }
});

// Success route
router.get("/success", isLoggedIn, (req, res) => {
    try {
        // Clear cart session
        if (req.session.cart) {
            req.session.cart = [];
        }

        req.flash("success", "Payment successful!", "Item will be Delivered Soon");
        res.redirect("/listings"); // or /cart/show if you want
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/cart/show");
    }
});

module.exports = router;

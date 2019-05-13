const express = require("express");
const router = express.Router();
const stripeSecret = process.env.STRIPE_PRIVATE;
const stripePublic = process.env.STRIPE_PUBLIC;
const stripe = require("stripe")(`${stripeSecret}`);
const Offer = require('../models/Offer');
const Payment = require('../models/Payment');

// Create offers
// Update offer state (and details)
// Get offers from a professional to a user
// Get user (pending, rejected, acepted) offers
// Get specific payment
// Create a payment
// Update a payment

// STORY: A professional creates an offer to their client. The client accepts or rejects it.
// Now the offer is in pending state.
// The user pays and the payment changes its state
// When the user has paid, he can make a review of the professional

// router.get('', (req, res, next) => {

// });

module.exports = router;
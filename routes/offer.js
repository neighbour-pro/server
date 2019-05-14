const express = require("express");
const router = express.Router();
const stripeSecret = process.env.STRIPE_PRIVATE;
const stripePublic = process.env.STRIPE_PUBLIC;
const stripe = require("stripe")(`${stripeSecret}`);
const Offer = require('../models/Offer');
const Payment = require('../models/Payment');

// Create offers
router.post('/new', (req, res, next) => {
  const payment = new Payment({
    client_id: req.body.clientId,
    quota: +req.body.price,
    status: 'Pending',
    limitDay: new Date(req.body.limitDay),
    invoice: ''
  });
  payment.save()
    .then(payment => {
      return Offer.create({
        client_id: req.body.clientId,
        professional_id: req.body.professionalId,
        status: 'Pending',
        description: req.body.description,
        price: +req.body.price,
        date: new Date(req.body.limitDay),
        payment_id: payment
      });
    })
    .then(offer => res.status(200).json({
      message: 'Created new offer',
      offer: offer
    }))
    .catch(err => res.status(500).json({
      error:err
    }));
});

// Update offer details
// router.put('/edit/:offerId', (req, res, next) => {
//   Offer.findByIdAndUpdate(req.params.id, {
//     description: req.body.description,
//     price: +req.body.price,
//     date: new Date(req.body.limitDay)  
//   }, {new: true})
//   .then(offer => {
//     return Payment.findByIdAndUpdate(offer.payment_id._id, {
//       quota: +req.body.price,
//       limitDay: new Date(req.body.limitDay)
//     }, {new: true})
//   })
//   .then(payment => res.status(200).json(payment))
//   .catch(err => res.status(500).json({error:err}));
// });

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
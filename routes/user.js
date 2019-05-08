const express = require("express");
const router = express.Router();
const User = require('../models/User');

router.get('/nearme/:longitude/:latitude/:radius?', (req, res, next) => {
  let radius = +req.params.radius;
  let lng = +req.params.longitude;
  let lat = +req.params.latitude;
  if(isNaN(radius)) radius = 100000; // 100km
  User.find({
    role:'Professional',
    location: {
      $near: {
        $maxDistance: radius,
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
      }
    }
  })
  .then(users => {
    res.status(200).json({
      users
    });
    return;
  })
  .catch(err => res.status(500).json({
    message: 'Error getting the users',
    error: err
  }));
});

module.exports = router;
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
  .populate({path:'reviews', populate: {path:'fromUserId', model:'User'}})
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

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id)
    .populate({path: 'reviews', populate: {path: 'fromUserId', model: 'User'}})
    .then(user => {
      if(!user){
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }
      res.status(200).json({
        user
      });
      return;
    })
    .catch(err => res.status(500).json({
      message: 'Error getting the specified user',
      error: err
    }));
});

module.exports = router;
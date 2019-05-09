const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Image = require('../models/Image');
const bcrypt = require('bcrypt');
const uploadCloud = require('../config/cloudinary.js');

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

router.put('/:id/update', uploadCloud.single('image'), (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(req.body.password, salt);
      switch(user.role){
        case 'Client':
          User.findByIdAndUpdate(user.id, {
            name: req.body.name,
            email: req.body.email,
            password: hashPass,
            lastSeen: Date.now(),
            phone: req.body.phone,
            role: req.body.role,
          }, {new: true})
          .then(user => {
            res.status(200).json({
              message: 'User updated sucessfully',
              user
            });
            return;
          })
          .catch(err => res.status(500).json({
            message: 'Error updating the user',
            error: err
          }));
        break;
        case 'Professional':
          User.findByIdAndUpdate(user.id, {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            lastSeen: Date.now(),
            phone: req.body.phone,
            description: req.body.description,
            services: req.body.services,
            role: req.body.role,
            "location.coordinates.0": +req.body.lng,
            "location.coordinates.1": +req.body.lat
          }, {new: true})
          .then(user => {
            res.status(200).json({
              message: 'User updated sucessfully',
              user
            });
            return;
          })
          .catch(err => res.status(500).json({
            message: 'Error updating the user',
            error: err
          }));
        break;
      }
    })
    .catch(err => res.status(500).json({
      message: 'Error updating the user',
      error: err
    }));
});

router.delete('/:id/delete', (req, res, next) => {
  User.deleteOne({_id: req.params.id})
    .then(user => {
      if(!user){
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }
      res.status(200).json({
        message: 'User deleted successfully',
      });
      return;
    })
    .catch(err => res.status(500).json({
      message: 'Error removing the specified user',
      error: err
    }));
});

module.exports = router;
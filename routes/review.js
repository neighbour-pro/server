const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Image = require('../models/Image');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');
const uploadCloud = require('../config/cloudinary.js');

router.post('/add/:proId/:clientId', (req, res, next) => {
  const {stars, comment} = req.body;
  const review = new Review({
    fromUserId: req.params.clientId,
    stars,
    comment
  });
  review.save()
    .then(review => User.findByIdAndUpdate(req.params.proId, {
      $push: {
        reviews: review
      }
    }, {new: true}))
    .then(user => res.status(200).json({
      message: 'Review created successfully',
      user
    }))
    .catch(err => res.status(500).json({
      message: 'There was an error creating the review',
      error: err
    }));

});

router.post('/images/:reviewId', uploadCloud.array('photos'), (req, res, next) => {
  let images = req.files;
  let pictures = images.map(picture => new Image({
    path: picture.url,
    name: picture.originalname
  }));
  let savedPictures = pictures.map(picture => picture.save());
  Promise.all(savedPictures)
    .then(img => {
      Review.findByIdAndUpdate(req.params.reviewId, {
        $push: {
          images: {
            $each: img
          }
        }
      }, {new: true})
      .populate('images')
      .then(review => res.status(200).json({
        message: 'Review updated sucessfully',
        review
      }))
      .catch(err => res.status(500).json({
        message: 'There was a problem updating the review',
        error: err
      }));
    })
    .catch(err => res.status(500).json({
      message: 'An error happened',
      error: err
    }));
});

module.exports = router;
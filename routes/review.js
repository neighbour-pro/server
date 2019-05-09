const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Image = require('../models/Image');
const Review = require('../models/Review');
const bcrypt = require('bcrypt');
const uploadCloud = require('../config/cloudinary.js');

router.post('/:reviewId/images', uploadCloud.array('photos'), (req, res, next) => {
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
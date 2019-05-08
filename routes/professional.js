const express = require("express");
const router = express.Router();
const Professional = require("../models/Professional");

router.get('/all', (req, res, next) => {
  Professional.find()
    .then(professionals => {
      res.status(200).json({
        data: professionals
      })
    })
    .catch(err => res.status(500).json({
      message: 'Error retrieving the data',
      error: err
    }));
});

module.exports = router;
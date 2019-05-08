const express = require("express");
const router = express.Router();
const Professional = require("../models/Professional");

router.get('/all', (req, res, next) => {
  Professional.find()
    .then(professionals => {
      res.status(200).json({
        data: professionals
      });
    })
    .catch(err => res.status(500).json({
      message: 'Error retrieving the data',
      error: err
    }));
});

router.get('/:id', (req, res, next) => {
  Professional.findById(req.params.id)
    .then(professional => {
      res.status(200).json({
        data: professional
      });
    })
    .catch(err => res.status(500).json({
      message: 'Error retrieving the data',
      error: err,
    }));
});

module.exports = router;
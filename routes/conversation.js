const express = require("express");
const router = express.Router();
const User = require('../models/User');
const Conversation = require('../models/Conversation');

router.get('/:id', (req, res, next) => {
  Conversation.find({
    $or: [
      {
        client_id: req.params.id
      },
      {
        professional_id: req.params.id
      }
    ]
  })
  .then(conversations => {
    res.status(200).json({
      conversations
    });
    return;
  })
  .catch(err => res.status(500).json({
    error: err
  }));
});

module.exports = router;
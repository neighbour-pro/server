const express = require("express");
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

router.get('/:id', (req, res, next) => {
  Conversation.findOne({
    $or: [
      {
        client_id: req.params.id
      },
      {
        professional_id: req.params.id
      }
    ]
  })
  .populate('messages')
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

router.post('/add/:fromId/:toId', (req, res, next) => {
  Conversation.create({
    client_id: req.params.fromId,
    professional_id: req.params.toId,
    messages: []
  })
  .then(conversation => {
    res.status(200).json(conversation)
  })
  .catch(err => res.status(500).json({
    error:err
  }));
});

router.post('/:id/addMessage', (req, res, next) => {
  const message = new Message({
    text: req.body.text,
    user_id: req.body.userId
  });
  message.save()
  .then(message => Conversation.findByIdAndUpdate(req.params.id, {
    $push: {
      messages: message
    }
  }, {new: true}))
  .then(conversation => res.status(200).json(conversation))
  .catch(err => res.status(500).json({error: err}));
});



module.exports = router;
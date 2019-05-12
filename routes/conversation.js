const express = require("express");
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

router.get('/:userId', (req, res, next) => {
  Conversation.find({
    $or: [
      {
        client_id: req.params.userId
      },
      {
        professional_id: req.params.userId
      }
    ]
  })
  .populate('messages')
  .populate('client_id')
  .populate('professional_id')
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

router.get('/:conversationId/messageList', (req, res, next) => {
  const socket_id = [];
  const io = req.app.get('socketio');
  io.on('connection', socket => {
    console.log('Hello')
    socket_id.push(socket.id);
    if(socket_id[0] === socket.id){
      io.removeAllListeners('connection');
    }
    socket.on('hello message', msg => {
      console.log('just got: '+ msg);
      socket.emit('chat message', 'hi from server');
    });
  });
  
  
  
  Conversation.findById(req.params.conversationId)
    .populate({path: 'messages', populate: {path: 'user_id', select: 'name'}})
    .then(conversation => {
      res.status(200).json({
        conversation
      });
    })
    .catch(err => res.status(500).json({
      error: err
    }));
});

router.post('/:conversationId/addMessage', (req, res, next) => {
  const message = new Message({
    text: req.body.text,
    user_id: req.body.userId
  });
  message.save()
  .then(message => Conversation.findByIdAndUpdate(req.params.conversationId, {
    $push: {
      messages: message
    }
  }, {new: true}))
  .then(conversation => res.status(200).json(conversation))
  .catch(err => res.status(500).json({error: err}));
});



module.exports = router;
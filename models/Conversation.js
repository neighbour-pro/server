const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  professional_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
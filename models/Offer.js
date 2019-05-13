const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const offerSchema = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  professional_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Rejected', 'Acepted'],
    default: 'Pending',
    required: true
  },
  description: String,
  price: Number,
  date: Date,
  payment_id: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  }
});


module.exports = mongoose.model('Offer', offerSchema);
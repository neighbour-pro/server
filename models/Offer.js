const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const offerSchema = new Schema({
  status: {
    type: String,
    enum: [],
    default: '',
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
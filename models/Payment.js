const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  client_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  quota: Number,
  status: {
    type: String,
    enum: [],
    default: ''
  },
  limitDay: Date,
  invoice: String
});


module.exports = mongoose.model('Payment', paymentSchema);
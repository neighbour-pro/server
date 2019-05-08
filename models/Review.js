const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model('Review', new Schema({
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  stars: {
    type: String,
    enum: ['1', '2', '3', '4', '5'],
  },
  comment: String,
  images: [{type: Schema.Types.ObjectId, ref: 'Image'}],
}, {
  timestamps: true,
}));
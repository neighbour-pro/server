const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ratingSchema = new Schema({
  stars: {
    type: String,
    enum: ['1', '2', '3', '4', '5']
    required: true
  },
  comment: String
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;

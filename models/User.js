const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model('User', new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  image_id: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
    default: '',
  },
  lastSeen: Date,
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  },
  description: String,
  services: String,
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  role: {
    type: String,
    enum: ['Client', 'Professional']
  }
}, {
  timestamps: true,
}));
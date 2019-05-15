const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      default: [-3.6982669, 40.3925321],
      required: true,
    },
  },
  userPhoto: {type: String, default: "http://res.cloudinary.com/djvxspy9s/image/upload/v1557428753/neighbour-pro/default.jpg.jpg"},
  description: String,
  services: String,
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  role: {
    type: String,
    enum: ['Client', 'Professional']
  }
}, {
  timestamps: true,
});

userSchema.index({location:'2dsphere'});

module.exports = mongoose.model('User', userSchema);

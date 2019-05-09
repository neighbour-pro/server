const mongoose = require('mongoose');
const Schema = mongoose.Schema;

<<<<<<< HEAD
const userSchema = new Schema({
=======

module.exports = mongoose.model('User', new Schema({
>>>>>>> a7c196bec3becb811d127f3e8460b512868cec12
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
      default: [-129.354104, -18.551005],
      required: true,
    },
  },
  imageId: {
    type: Schema.Types.ObjectId,
    ref: 'Image',
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
});

userSchema.index({location:'2dsphere'});

module.exports = mongoose.model('User', userSchema);

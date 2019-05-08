const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const professionalSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  password: String,
  image: {
    type: String,
    default: ''
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
  ratings: [{type: Schema.Types.ObjectId, ref:'Rating'}],
  services: [{type: Schema.Types.ObjectId, ref: 'Service'}],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

const Professional = mongoose.model('Professional', professionalSchema);
module.exports = Professional;

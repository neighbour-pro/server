const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const clientSchema = new Schema({
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
    unique: true,
  },
  ratings: [{type: Schema.Types.ObjectId, ref: 'Rating'}],
  password: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;

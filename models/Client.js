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
  phone: String,
  ratings: [Schema.Types.ObjectId],
  password: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;

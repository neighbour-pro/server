const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const serviceSchema = new Schema({
  description: {
    type: String,
    required: true
  },
},
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;

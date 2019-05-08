const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model('Image', new Schema({
  path: String,
  name: String
}, {
  timestamps: true,
}));
const mongoose = require('mongoose');

const AlbaSchema = new mongoose.Schema({
  id: Number,
  name: String,
  addresses: Number,
  status: String,
  details: String,
  link: String,
});

module.exports = mongoose.model('Alba', AlbaSchema);

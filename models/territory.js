const mongoose = require('mongoose');

const TerritorySchema = new mongoose.Schema({
  id: String,
  city: String,
  number: String,
  assignments: [
    {
      name: String,
      dateUgly: Date,
      date: String,
      out: Boolean,
    },
  ],
});

module.exports = mongoose.model('Territory', TerritorySchema);

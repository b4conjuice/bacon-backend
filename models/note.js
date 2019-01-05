const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: String,
  body: String,
});

module.exports = mongoose.model('Note', NoteSchema);

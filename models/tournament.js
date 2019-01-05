const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: String,
  slug: String,
  date: Date,
  dateFormatted: String,
  link: String,
  score: Number,
  attendees: Number,
  rankedPlayers: [
    {
      gamerTag: String,
      prefix: String,
      rank: Number,
      score: Number,
    },
  ],
  topPlayers: [
    {
      gamerTag: String,
      prefix: String,
      rank: Number,
      score: Number,
    },
  ],
});

module.exports = mongoose.model('Tournament', TournamentSchema);

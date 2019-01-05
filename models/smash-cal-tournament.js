const mongoose = require('mongoose');

const SmashCalTournamentSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  startDateFormatted: String,
  endDate: Date,
  endDateFormatted: String,
  weekNumber: String,
  region: String,
  subregion: String,
  city: String,
  organizer: String,
  smashgg: String,
  slug: String,
  meleeText: String,
  melee: Boolean,
  wiiuText: String,
  wiiu: Boolean,
});

module.exports = mongoose.model('SmashCalTournament', SmashCalTournamentSchema);

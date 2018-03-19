import mongoose, { Schema } from "mongoose";

const SmashCalTournamentSchema = new Schema({
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
  wiiu: Boolean
});

export default mongoose.model("SmashCalTournament", SmashCalTournamentSchema);

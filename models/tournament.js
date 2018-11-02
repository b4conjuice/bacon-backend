import mongoose, { Schema } from 'mongoose';

const TournamentSchema = new Schema({
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

export default mongoose.model('Tournament', TournamentSchema);

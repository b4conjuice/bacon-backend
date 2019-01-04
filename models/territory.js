import mongoose, { Schema } from 'mongoose';

const TerritorySchema = new Schema({
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

export default mongoose.model('Territory', TerritorySchema);

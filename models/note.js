import mongoose, { Schema } from 'mongoose';

const NoteSchema = new Schema({
  title: String,
  body: String,
});

export default mongoose.model('Note', NoteSchema);

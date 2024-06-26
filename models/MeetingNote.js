import mongoose from 'mongoose';

// Define Action Item Schema
const ActionItemSchema = new mongoose.Schema({
  id: Number,
  text: String,
  completed: Boolean
});

// Meeting note schema
const MeetingNoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  actionItems: [ActionItemSchema],
  createdDate: { type: Date, default: Date.now }
});

const MeetingNote = mongoose.model('MeetingNote', MeetingNoteSchema);

export default MeetingNote;

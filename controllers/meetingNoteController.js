import * as meetingNoteService from './../services/meetingNoteService.js';

// Status for gettinig meeting notes
export const getAllMeetingNotes = async (req, res) => {
  try {
    const meetingNotes = await meetingNoteService.getAllMeetingNotes();
    res.json(meetingNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Status for filtering meeting notes
export const filterMeetingNotes = async (req, res) => {
  try {
    const { keywords, startDate, endDate } = req.query;
    const filteredMeetingNotes = await meetingNoteService.filterMeetingNotes(keywords, startDate, endDate);
    res.json(filteredMeetingNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Status for adding meeting notes
export const addMeetingNote = async (req, res) => {
  try {
    const meetingNoteData = req.body;
    const newMeetingNote = await meetingNoteService.addMeetingNote(meetingNoteData);
    res.status(201).json(newMeetingNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Status for updating meeting notes
export const updateMeetingNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedMeetingNote = await meetingNoteService.updateMeetingNote(id, updatedData);
    res.json(updatedMeetingNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Status for deleting meeting notes
export const deleteMeetingNote = async (req, res) => {
  try {
    const { id } = req.params;
    await meetingNoteService.deleteMeetingNote(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import MeetingNote from './../models/MeetingNote.js';

// Return all meeting notes
export const getAllMeetingNotes = async () => {
  return await MeetingNote.find();
};

// Filter meeting notes
export const filterMeetingNotes = async (keywords, startDate, endDate) => {
  const filter = {};

  if (keywords) {
    // Check if keywords are provided
    filter.$or = [
      { title: { $regex: keywords, $options: 'i' } },
      { content: { $regex: keywords, $options: 'i' } },
      { 'actionItems.text': { $regex: keywords, $options: 'i' } }
    ];
  }

  if (!startDate && !endDate && keywords) {
    // If only keywords are provided
    try {
      return await MeetingNote.find(filter).exec();
    } catch (error) {
      throw new Error('Error filtering meeting notes: ' + error.message);
    }
  }

  if (startDate && endDate) {
    // If both startDate and endDate are provided
    if (!keywords) {
      // If no keyword provided, filter only by date range
      filter.createdDate = { $gte: startDate, $lte: endDate };
    } else {
      // If keyword is provided, filter by both keyword and date range
      filter.$and = [{ createdDate: { $gte: startDate, $lte: endDate } }, filter.$or];
      delete filter.createdDate;
    }
  } else if (startDate) {
    // If only startDate is provided
    if (!keywords) {
      // If no keyword provided, filter only by startDate
      filter.createdDate = { $gte: startDate };
    } else {
      // If keyword is provided, filter by both keyword and startDate
      filter.$and = [{ createdDate: { $gte: startDate } }, filter.$or];
      delete filter.createdDate;
    }
  } else if (endDate) {
    // If only endDate is provided
    if (!keywords) {
      // If no keyword provided, filter only by endDate
      filter.createdDate = { $lte: endDate };
    } else {
      // If keyword is provided, filter by both keyword and endDate
      filter.$and = [{ createdDate: { $lte: endDate } }, filter.$or];
      delete filter.createdDate;
    }
  }

  try {
    if (keywords || startDate || endDate) {
      // If any filter is applied, return filtered meeting notes
      return await MeetingNote.find(filter).exec();
    } else {
      // If no filter is applied, return all meeting notes
      return await MeetingNote.find();
    }
  } catch (error) {
    throw new Error('Error filtering meeting notes: ' + error.message);
  }
};

// Add a new meeting note
export const addMeetingNote = async (meetingNoteData) => {
  return await MeetingNote.create(meetingNoteData);
};

// Update an existing meeting note
export const updateMeetingNote = async (id, updatedData) => {
  return await MeetingNote.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a meeting note
export const deleteMeetingNote = async (id) => {
  return await MeetingNote.findByIdAndDelete(id);
};

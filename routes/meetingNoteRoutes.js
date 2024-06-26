import express from 'express';
import * as meetingNoteController from './../controllers/meetingNoteController.js';

const router = express.Router();

// Routes
router.get('/', meetingNoteController.getAllMeetingNotes);
router.get('/filter', meetingNoteController.filterMeetingNotes);
router.post('/', meetingNoteController.addMeetingNote);
router.put('/:id', meetingNoteController.updateMeetingNote);
router.delete('/:id', meetingNoteController.deleteMeetingNote);

export default router;
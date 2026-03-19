const express = require('express');
const router = express.Router();
const {
  getEvents, getEventById, createEvent, updateEvent,
  deleteEvent, approveEvent, rejectEvent, getMyEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.get('/', getEvents);
router.get('/my-events', protect, getMyEvents);
router.get('/:id', getEventById);
router.post('/', protect, upload.single('photo'), createEvent);
router.put('/:id', protect, upload.single('photo'), updateEvent);
router.delete('/:id', protect, deleteEvent);
router.patch('/:id/approve', protect, authorize('admin'), approveEvent);
router.patch('/:id/reject', protect, authorize('admin'), rejectEvent);

module.exports = router;
const express = require('express')
const router = express.Router()
const {
  getEvents, getMyEvents, getEventById, createEvent, updateEvent,
  deleteEvent, approveEvent, rejectEvent
} = require('../controllers/eventController')
const { protect } = require('../middleware/auth')
const { authorize } = require('../middleware/authorize')
const upload = require('../middleware/upload')

router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    protect(req, res, next)
  } else {
    next()
  }
}, getEvents)
router.get('/my-events', protect, getMyEvents)
router.get('/:id', getEventById)
router.post('/', protect, upload.single('photo'), createEvent)
router.put('/:id', protect, upload.single('photo'), updateEvent)
router.delete('/:id', protect, deleteEvent)
router.patch('/:id/approve', protect, authorize('admin'), approveEvent)
router.patch('/:id/reject', protect, authorize('admin'), rejectEvent)

module.exports = router
const express = require('express')
const router = express.Router()
const { createFeedback, getEventFeedback, getMyFeedback } = require('../controllers/feedbackController')
const { protect } = require('../middleware/auth')

router.post('/', protect, createFeedback)
router.get('/event/:eventId', getEventFeedback)
router.get('/my-feedback', protect, getMyFeedback)

module.exports = router
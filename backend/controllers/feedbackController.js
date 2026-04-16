const Feedback = require('../models/Feedback')
const Event = require('../models/Event')
const Registration = require('../models/Registration')

// POST /api/feedback
const createFeedback = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body

    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Event not found' })

    // Ελέγχουμε αν το event έχει περάσει
    const now = new Date()
    if (new Date(event.eventDate) > now) {
      return res.status(400).json({ message: 'You can only leave feedback after the event has taken place' })
    }

    // Ελέγχουμε αν ο χρήστης ήταν εγγεγραμμένος
    const registration = await Registration.findOne({
      event: eventId,
      user: req.user._id
    })
    if (!registration) {
      return res.status(403).json({ message: 'You can only leave feedback for events you attended' })
    }

    const existing = await Feedback.findOne({ event: eventId, user: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted feedback for this event' })
    }

    const feedback = await Feedback.create({
      event: eventId,
      user: req.user._id,
      rating,
      comment
    })

    res.status(201).json(feedback)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted feedback for this event' })
    }
    res.status(500).json({ message: error.message })
  }
}

// GET /api/feedback/event/:eventId
const getEventFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate('user', 'fullName role')
      .sort({ createdAt: -1 })

    const average = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
      : null

    res.json({ feedback, average, total: feedback.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/feedback/my-feedback
const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id })
      .populate('event', 'title eventDate')
      .sort({ createdAt: -1 })
    res.json(feedback)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createFeedback, getEventFeedback, getMyFeedback }
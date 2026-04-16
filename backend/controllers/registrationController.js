const Registration = require('../models/Registration');
const { sendRegistrationConfirmation } = require('../utils/emailService')
const Event = require('../models/Event');
const crypto = require('crypto');

// GET /api/registrations
const getRegistrations = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user._id };
    const registrations = await Registration.find(query)
      .populate('event', 'title eventDate')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/registrations/my-registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title eventDate startTime location status photo')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/registrations
const registerForEvent = async (req, res) => {
  try {
    const { eventId, fullName, email, phoneNumber, department, dietaryRequirements, specialNeeds } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.status !== 'published') return res.status(400).json({ message: 'Event is not available for registration' });

    if (event.maxCapacity && event.currentAttendees >= event.maxCapacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }

    const existing = await Registration.findOne({ event: eventId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered for this event' });

    const confirmationCode = crypto.randomBytes(6).toString('hex').toUpperCase();

    const registration = await Registration.create({
      event: eventId,
      user: req.user._id,
      fullName, email, phoneNumber,
      department, dietaryRequirements, specialNeeds,
      confirmationCode
    })

    await Event.findByIdAndUpdate(eventId, { $inc: { currentAttendees: 1 } })

    // Send confirmation email
    sendRegistrationConfirmation(email, fullName, event, confirmationCode)

    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Already registered for this event' });
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/registrations/:id
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    const isOwner = registration.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await Event.findByIdAndUpdate(registration.event, { $inc: { currentAttendees: -1 } });
    await registration.deleteOne();

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
    res.json(registrations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getRegistrations, getMyRegistrations, getEventRegistrations, registerForEvent, cancelRegistration }
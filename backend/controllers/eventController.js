const Event = require('../models/Event');
const { sendEventApproved, sendEventRejected } = require('../utils/emailService')
const User = require('../models/User')

// GET /api/events
const getEvents = async (req, res) => {
  try {
    const { search, type, department, showAll, status } = req.query

    let query = {}

    if (showAll && req.user?.role === 'admin') {
      // Admin βλέπει όλα
    } else if (status === 'archived') {
      query.status = 'archived'
    } else {
      query.status = 'published'
    }

    if (search) query.$text = { $search: search }
    if (type) query.eventType = type
    if (department) query.department = { $regex: department, $options: 'i' }

    const events = await Event.find(query)
      .populate('organizer', 'fullName email')
      .populate('location')
      .sort({ eventDate: 1 })

    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/events/my-events
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('location')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'fullName email department')
      .populate('location');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/events
const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, organizer: req.user._id };

    if (req.file) eventData.photo = `/uploads/${req.file.filename}`;

    // CC organizers publish directly, external go to pending
    if (req.user.role === 'cc_organizer' || req.user.role === 'admin') {
      eventData.status = 'published';
    } else {
      eventData.status = 'pending';
    }

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isOwner = event.organizer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    if (req.file) req.body.photo = `/uploads/${req.file.filename}`;

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const isOwner = event.organizer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/events/:id/approve
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, {
      status: 'published',
      approvedBy: req.user._id,
      approvalDate: new Date()
    }, { new: true })
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const organizer = await User.findById(event.organizer)
    if (organizer) {
      sendEventApproved(organizer.email, organizer.fullName, event)
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PATCH /api/events/:id/reject
const rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, {
      status: 'rejected',
      rejectionReason: req.body.reason || ''
    }, { new: true })
    if (!event) return res.status(404).json({ message: 'Event not found' })

    const organizer = await User.findById(event.organizer)
    if (organizer) {
      sendEventRejected(organizer.email, organizer.fullName, event.title, req.body.reason)
    }

    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getEvents, getMyEvents, getEventById, createEvent, updateEvent, deleteEvent, approveEvent, rejectEvent };
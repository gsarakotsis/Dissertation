const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  eventType: {
    type: String,
    required: true,
    enum: [
      'merchandise', 'speaking_event', 'party', 'conference',
      'sports', 'volunteering', 'internship', 'club', 'phd_award', 'other'
    ]
  },
  department: { type: String, default: '' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },

  locationType: { type: String, enum: ['premises', 'external'], default: 'premises' },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  externalLocation: { type: String, default: '' },

  maxCapacity: { type: Number, default: null },
  currentAttendees: { type: Number, default: 0 },
  registrationDeadline: { type: Date },

  photo: { type: String, default: '' },
  externalLink: { type: String, default: '' },
  specialRequirements: { type: String, default: '' },

  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'published', 'cancelled', 'completed', 'archived'],
    default: 'draft'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvalDate: { type: Date },
  rejectionReason: { type: String, default: '' }
}, { timestamps: true });

// Text index for search
eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
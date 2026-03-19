const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['event_approval', 'event_rejected', 'event_cancelled', 'registration_confirmed', 'event_reminder', 'system'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
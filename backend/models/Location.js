const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  buildingName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  roomName: { type: String, default: '' },
  floor: { type: Number, default: 0 },
  capacity: { type: Number, required: true },
  roomType: {
    type: String,
    enum: ['classroom', 'lab', 'hall', 'auditorium', 'conference', 'outdoor'],
    default: 'classroom'
  },
  externalAddress: { type: String, default: '' },
  equipment: [{ type: String }],
  accessibility: { type: Boolean, default: false },
  photos: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);
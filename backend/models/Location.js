const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  buildingName: { type: String, required: true },
  roomName: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Location', locationSchema)
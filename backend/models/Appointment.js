const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  doctor: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  room: { type: String },
  visitType: { type: String, enum: ['New Patient', 'Follow-up', 'Urgent'], default: 'New Patient' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
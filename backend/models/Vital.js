const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patient: { type: String, required: true },
  bp: { type: String, required: true },
  temp: { type: String, required: true },
  pulse: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vital', vitalSchema);
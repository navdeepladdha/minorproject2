const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffCount: { type: Number, default: 0 },
  patientCount: { type: Number, default: 0 },
  budget: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Department', departmentSchema);
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Urgent'], default: 'Pending' },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
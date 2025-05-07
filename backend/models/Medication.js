const mongoose = require('mongoose');

   const medicationSchema = new mongoose.Schema({
     patient: { type: String, required: true },
     medication: { type: String, required: true },
     dosage: { type: String, required: true },
     schedule: { type: String, required: true },
     createdAt: { type: Date, default: Date.now }
   });

   module.exports = mongoose.model('Medication', medicationSchema);
const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    slots: {
        type: Object, // Maps dates (e.g., "2025-05-07") to arrays of time slots (e.g., ["09:00", "10:00"])
        required: true,
    },
});

module.exports = mongoose.model('Doctor', DoctorSchema);
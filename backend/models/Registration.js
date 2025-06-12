const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Completed', 'Pending'],
    },
});

module.exports = mongoose.model('Registration', RegistrationSchema);
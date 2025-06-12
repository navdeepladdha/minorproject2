const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['info', 'warning', 'critical'], // Based on the types used in seed.js
    },
});

module.exports = mongoose.model('Alert', AlertSchema);
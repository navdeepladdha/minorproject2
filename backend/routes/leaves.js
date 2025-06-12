const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Leave = require('../models/Leave'); // Import the Leave model

// Middleware to restrict access to nurses
const restrictToNurse = (req, res, next) => {
  if (req.user.role !== 'nurse') {
    return res.status(403).json({ message: 'Access denied: Only nurses can submit leave applications' });
  }
  next();
};

router.post('/', authMiddleware, restrictToNurse, async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    // Validation
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (reason.length < 5) {
      return res.status(400).json({ message: 'Reason must be at least 5 characters' });
    }

    const leave = new Leave({
      nurseId: req.user._id,
      nurseName: `${req.user.firstName} ${req.user.lastName}`,
      startDate,
      endDate,
      reason,
    });

    await leave.save();
    res.status(201).json({ message: 'Leave application submitted', leave });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
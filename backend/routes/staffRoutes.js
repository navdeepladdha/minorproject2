const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/dashboard', authMiddleware, roleMiddleware(['staff']), staffController.getDashboardData);
router.post('/patients', authMiddleware, roleMiddleware(['staff']), staffController.registerPatient);

module.exports = router;
const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/dashboard', authMiddleware, roleMiddleware(['nurse']), nurseController.getDashboardData);
router.put('/vitals/:patientId', authMiddleware, roleMiddleware(['nurse']), nurseController.updatePatientVitals);

module.exports = router;
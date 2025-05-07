const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), adminController.getDashboardData);
router.post('/departments', authMiddleware, roleMiddleware(['admin']), adminController.createDepartment);
router.get('/users', authMiddleware, roleMiddleware(['admin']), adminController.getUsers);

module.exports = router;
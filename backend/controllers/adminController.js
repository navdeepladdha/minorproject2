const User = require('../models/User');
const Department = require('../models/Department');

exports.getDashboardData = async (req, res) => {
  try {
    const staff = await User.find({ role: { $ne: 'admin' } }).select('firstName lastName role status');
    const departments = await Department.find();
    const alerts = [
      { id: 1, type: 'critical', title: 'System Maintenance', message: 'Scheduled downtime at 2 AM' },
      { id: 2, type: 'warning', title: 'Staff Shortage', message: 'Need more nurses in ER' },
      { id: 3, type: 'info', title: 'New Policy', message: 'Updated privacy policy effective tomorrow' },
    ];

    res.json({
      staff: staff.map(s => ({
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        role: s.role,
        department: 'General', // Placeholder
        status: s.status,
      })),
      departments,
      alerts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createDepartment = async (req, res) => {
  const { name, staffCount, patientCount, budget } = req.body;

  try {
    const department = new Department({ name, staffCount, patientCount, budget });
    await department.save();
    res.json({ success: true, department });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
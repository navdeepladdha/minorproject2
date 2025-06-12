const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
const Appointment = require('./models/Appointment');
const Department = require('./models/Department');
const Alert = require('./models/Alert');
const Vital = require('./models/Vital');
const Task = require('./models/Task');
const Registration = require('./models/Registration');
const leaveRoutes = require('./routes/leaves'); // Import leave routes

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8501'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Routes
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/prescriptions', authenticateToken, async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate('patientId');
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/doctors', authenticateToken, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/departments', authenticateToken, async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/departments', authenticateToken, async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/alerts', authenticateToken, async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/vitals', authenticateToken, async (req, res) => {
  try {
    const vitals = await Vital.find();
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/registrations', authenticateToken, async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add route for staff data
app.get('/api/staff', authenticateToken, async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ['doctor', 'nurse', 'staff'] },
    }).select('firstName lastName role department status');

    const staffData = staff.map((user, index) => ({
      id: index + 1,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      department: user.department || 'Unassigned',
      status: user.status || 'Active',
    }));

    res.json(staffData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }
  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'User not found', email });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = jwt.sign(
      { id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Placeholder routes for other dashboards
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/doctor/dashboard', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id });
    const patients = await Patient.find();
    const prescriptions = await Prescription.find();
    const leaves = await Leave.find({ status: 'pending' }); // Add pending leaves for doctor dashboard
    res.json({
      appointments,
      patients,
      prescriptions,
      leaves,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/doctor/patients/:patientId', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/doctor/prescriptions', authenticateToken, async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/nurse/dashboard', authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.find();
    const vitals = await Vital.find();
    const tasks = await Task.find();
    res.json({
      patients,
      vitals,
      tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/nurse/patients/:patientId/vitals', authenticateToken, async (req, res) => {
  try {
    const vital = await Vital.findOneAndUpdate(
      { patientId: req.params.patientId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(vital);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/staff/dashboard', authenticateToken, async (req, res) => {
  try {
    const registrations = await Registration.find();
    const appointments = await Appointment.find();
    res.json({
      registrations,
      appointments,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Backward compatibility with the old /api/login route
app.post('/api/login', async (req, res) => {
  console.log('Login request received (legacy):', req.body);
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'User not found', email });
    }
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    });
  } catch (err) {
    console.error('Login error (legacy):', err);
    res.status(500).json({ message: err.message });
  }
});

// Add leave routes
app.use('/api/leaves', authenticateToken, leaveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
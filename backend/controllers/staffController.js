const Task = require('../models/Task');
   const Patient = require('../models/Patient');
   const Appointment = require('../models/Appointment');

   exports.getDashboardData = async (req, res) => {
     try {
       const tasks = await Task.find({ assignedTo: req.user.email });
       const registrations = await Patient.find();
       const schedule = await Appointment.find();

       res.json({
         tasks,
         registrations,
         schedule
       });
     } catch (error) {
       console.error('Staff dashboard error:', error);
       res.status(500).json({ message: 'Server error' });
     }
   };

   exports.registerPatient = async (req, res) => {
     const { name, age, diagnosis, department, status } = req.body;

     try {
       const patient = new Patient({ name, age, diagnosis, department, status });
       await patient.save();
       res.json({ success: true, patient });
     } catch (error) {
       console.error('Patient registration error:', error);
       res.status(500).json({ message: 'Server error' });
     }
   };
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');

exports.getDashboardData = async (req, res) => {
  try {
    const patients = await Patient.find({ doctorId: req.user.id });
    const appointments = []; // Add logic for appointments if needed
    res.json({ patients, appointments });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    console.error('Patient details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPrescription = async (req, res) => {
  const { patientId, medication, dosage, instructions } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const prescription = new Prescription({
      patientId,
      doctorId: req.user.id,
      medication,
      dosage,
      instructions
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription created successfully' });
  } catch (err) {
    console.error('Prescription error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
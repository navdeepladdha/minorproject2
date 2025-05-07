const Vital = require('../models/Vital');
   const Medication = require('../models/Medication');

   exports.getDashboardData = async (req, res) => {
     try {
       const patientVitals = await Vital.find();
       const medications = await Medication.find();

       res.json({
         patientVitals,
         medications
       });
     } catch (error) {
       console.error('Nurse dashboard error:', error);
       res.status(500).json({ message: 'Server error' });
     }
   };

   exports.updatePatientVitals = async (req, res) => {
     const { bp, temp, pulse } = req.body;

     try {
       const vital = new Vital({
         patient: req.params.patientId,
         bp,
         temp,
         pulse
       });
       await vital.save();
       res.json({ success: true, vital });
     } catch (error) {
       console.error('Vitals update error:', error);
       res.status(500).json({ message: 'Server error' });
     }
   };
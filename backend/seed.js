const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
const Department = require('./models/Department');
const Alert = require('./models/Alert');
const Vital = require('./models/Vital');
const Task = require('./models/Task');
const Registration = require('./models/Registration');
const Appointment = require('./models/Appointment');
const Medication = require('./models/Medication'); // Assuming you've created this model
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Drop the entire database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Users - 8 entries
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'doctor@example.com',
        password: hashedPassword,
        role: 'doctor',
        specialization: 'Cardiology',
        licenseNumber: 'LIC12345',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'doctor2@example.com',
        password: hashedPassword,
        role: 'doctor',
        specialization: 'Neurology',
        licenseNumber: 'LIC67890',
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'doctor3@example.com',
        password: hashedPassword,
        role: 'doctor',
        specialization: 'Pediatrics',
        licenseNumber: 'LIC24680',
      },
      {
        firstName: 'Emma',
        lastName: 'Williams',
        email: 'nurse@example.com',
        password: hashedPassword,
        role: 'nurse',
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'nurse2@example.com',
        password: hashedPassword,
        role: 'nurse',
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'staff@example.com',
        password: hashedPassword,
        role: 'staff',
      },
      {
        firstName: 'Lisa',
        lastName: 'Davis',
        email: 'staff2@example.com',
        password: hashedPassword,
        role: 'staff',
      },
    ];

    const insertedUsers = await User.insertMany(users);
    console.log('Users seeded:', insertedUsers.length);

    // Get IDs
    const doctor = insertedUsers.find((user) => user.email === 'doctor@example.com');
    const doctor2 = insertedUsers.find((user) => user.email === 'doctor2@example.com');
    const doctor3 = insertedUsers.find((user) => user.email === 'doctor3@example.com');
    const nurse = insertedUsers.find((user) => user.email === 'nurse@example.com');
    const nurse2 = insertedUsers.find((user) => user.email === 'nurse2@example.com');
    const staff = insertedUsers.find((user) => user.email === 'staff@example.com');
    const staff2 = insertedUsers.find((user) => user.email === 'staff2@example.com');
    
    const doctorId = doctor._id;
    const doctor2Id = doctor2._id;
    const doctor3Id = doctor3._id;
    const nurseId = nurse._id;
    const nurse2Id = nurse2._id;
    const staffId = staff._id;
    const staff2Id = staff2._id;

    // Create Doctors - 8 entries
    const doctors = [
      {
        name: 'Dr. John Doe',
        specialization: 'Cardiology',
        slots: {
          '2025-05-07': ['09:00', '10:00', '11:00'],
          '2025-05-08': ['13:00', '14:00', '15:00'],
          '2025-05-09': ['10:00', '11:00', '14:00'],
        },
      },
      {
        name: 'Dr. Jane Smith',
        specialization: 'Neurology',
        slots: {
          '2025-05-07': ['10:00', '11:00', '12:00'],
          '2025-05-08': ['14:00', '15:00', '16:00'],
          '2025-05-09': ['09:00', '13:00', '15:00'],
        },
      },
      {
        name: 'Dr. Sarah Johnson',
        specialization: 'Pediatrics',
        slots: {
          '2025-05-07': ['09:30', '10:30', '11:30'],
          '2025-05-08': ['13:30', '14:30', '15:30'],
          '2025-05-09': ['09:00', '10:00', '16:00'],
        },
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Orthopedics',
        slots: {
          '2025-05-07': ['08:00', '09:00', '14:00'],
          '2025-05-08': ['11:00', '12:00', '16:30'],
          '2025-05-09': ['13:00', '14:00', '15:00'],
        },
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialization: 'Dermatology',
        slots: {
          '2025-05-07': ['10:00', '11:00', '15:00'],
          '2025-05-08': ['09:00', '13:00', '16:00'],
          '2025-05-09': ['11:00', '12:00', '14:30'],
        },
      },
      {
        name: 'Dr. Robert Wilson',
        specialization: 'Ophthalmology',
        slots: {
          '2025-05-07': ['08:30', '09:30', '14:30'],
          '2025-05-08': ['10:30', '11:30', '15:30'],
          '2025-05-09': ['09:30', '13:30', '16:30'],
        },
      },
      {
        name: 'Dr. Lisa Park',
        specialization: 'Psychiatry',
        slots: {
          '2025-05-07': ['09:00', '10:00', '15:00'],
          '2025-05-08': ['11:00', '14:00', '16:00'],
          '2025-05-09': ['10:00', '13:00', '15:00'],
        },
      },
      {
        name: 'Dr. David Thompson',
        specialization: 'Endocrinology',
        slots: {
          '2025-05-07': ['08:00', '12:00', '16:00'],
          '2025-05-08': ['09:00', '13:00', '15:00'],
          '2025-05-09': ['11:00', '14:00', '16:00'],
        },
      },
    ];

    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log('Doctors seeded:', insertedDoctors.length);

    // Create Departments - 8 entries
    const departments = [
      {
        name: 'Cardiology',
        staffCount: 12,
        patientCount: 58,
        budget: 120000,
      },
      {
        name: 'Neurology',
        staffCount: 9,
        patientCount: 42,
        budget: 95000,
      },
      {
        name: 'Pediatrics',
        staffCount: 15,
        patientCount: 75,
        budget: 110000,
      },
      {
        name: 'Orthopedics',
        staffCount: 10,
        patientCount: 50,
        budget: 105000,
      },
      {
        name: 'Dermatology',
        staffCount: 7,
        patientCount: 65,
        budget: 85000,
      },
      {
        name: 'Ophthalmology',
        staffCount: 8,
        patientCount: 40,
        budget: 90000,
      },
      {
        name: 'Psychiatry',
        staffCount: 11,
        patientCount: 55,
        budget: 100000,
      },
      {
        name: 'Endocrinology',
        staffCount: 8,
        patientCount: 45,
        budget: 88000,
      },
    ];

    const insertedDepartments = await Department.insertMany(departments);
    console.log('Departments seeded:', insertedDepartments.length);

    // Create Alerts - 8 entries
    const alerts = [
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'System Maintenance',
        message: 'Scheduled downtime on May 10, 2025',
        type: 'info',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Staff Shortage',
        message: 'Cardiology department understaffed',
        type: 'warning',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Critical Equipment Failure',
        message: 'MRI machine offline',
        type: 'critical',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'New Protocol',
        message: 'Updated COVID-19 screening procedures',
        type: 'info',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Medication Shortage',
        message: 'Limited supply of insulin',
        type: 'warning',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Emergency Response Drill',
        message: 'Scheduled for May 15, 2025',
        type: 'info',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'Power Outage',
        message: 'Backup generators activated',
        type: 'critical',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        title: 'New Staff Onboarding',
        message: 'Welcome session on May 12, 2025',
        type: 'info',
      },
    ];

    const insertedAlerts = await Alert.insertMany(alerts);
    console.log('Alerts seeded:', insertedAlerts.length);

    // Create Patients - 8 entries
    const patients = [
      {
        name: 'Alice Johnson',
        age: 30,
        diagnosis: 'Hypertension',
        department: 'Cardiology',
        status: 'In Progress',
        doctorId: doctorId,
      },
      {
        name: 'Bob Miller',
        age: 45,
        diagnosis: 'Diabetes',
        department: 'Endocrinology',
        status: 'Pending',
        doctorId: doctorId,
      },
      {
        name: 'Carol White',
        age: 28,
        diagnosis: 'Asthma',
        department: 'Pulmonology',
        status: 'Stable',
        doctorId: doctorId,
      },
      {
        name: 'David Thompson',
        age: 52,
        diagnosis: 'Migraine',
        department: 'Neurology',
        status: 'In Progress',
        doctorId: doctor2Id,
      },
      {
        name: 'Emma Wilson',
        age: 8,
        diagnosis: 'Flu',
        department: 'Pediatrics',
        status: 'Recovering',
        doctorId: doctor3Id,
      },
      {
        name: 'Frank Chen',
        age: 62,
        diagnosis: 'Coronary Artery Disease',
        department: 'Cardiology',
        status: 'Critical',
        doctorId: doctorId,
      },
      {
        name: 'Grace Kim',
        age: 35,
        diagnosis: 'Eczema',
        department: 'Dermatology',
        status: 'Stable',
        doctorId: doctor2Id,
      },
      {
        name: 'Henry Davis',
        age: 70,
        diagnosis: 'Cataracts',
        department: 'Ophthalmology',
        status: 'Pre-Op',
        doctorId: doctor3Id,
      },
    ];

    const insertedPatients = await Patient.insertMany(patients);
    console.log('Patients seeded:', insertedPatients.length);

    // Create Prescriptions - 8 entries
    const prescriptions = [
      {
        patientId: insertedPatients[0]._id, // Alice
        doctorId: doctorId,
        medication: 'Lisinopril',
        dosage: '10mg daily',
        instructions: 'Take with water in the morning',
        createdAt: new Date('2025-05-01'),
      },
      {
        patientId: insertedPatients[1]._id, // Bob
        doctorId: doctorId,
        medication: 'Metformin',
        dosage: '500mg twice daily',
        instructions: 'Take with meals',
        createdAt: new Date('2025-05-02'),
      },
      {
        patientId: insertedPatients[2]._id, // Carol
        doctorId: doctorId,
        medication: 'Albuterol',
        dosage: '2 puffs as needed',
        instructions: 'Use during asthma attacks',
        createdAt: new Date('2025-05-01'),
      },
      {
        patientId: insertedPatients[3]._id, // David
        doctorId: doctor2Id,
        medication: 'Sumatriptan',
        dosage: '50mg as needed',
        instructions: 'Take at first sign of migraine',
        createdAt: new Date('2025-05-03'),
      },
      {
        patientId: insertedPatients[4]._id, // Emma
        doctorId: doctor3Id,
        medication: 'Oseltamivir',
        dosage: '30mg twice daily',
        instructions: 'Take with food for 5 days',
        createdAt: new Date('2025-05-04'),
      },
      {
        patientId: insertedPatients[5]._id, // Frank
        doctorId: doctorId,
        medication: 'Atorvastatin',
        dosage: '20mg daily',
        instructions: 'Take in the evening',
        createdAt: new Date('2025-05-02'),
      },
      {
        patientId: insertedPatients[6]._id, // Grace
        doctorId: doctor2Id,
        medication: 'Triamcinolone cream',
        dosage: 'Apply twice daily',
        instructions: 'Use on affected areas',
        createdAt: new Date('2025-05-03'),
      },
      {
        patientId: insertedPatients[7]._id, // Henry
        doctorId: doctor3Id,
        medication: 'Prednisolone eye drops',
        dosage: '1 drop 4 times daily',
        instructions: 'Use in both eyes',
        createdAt: new Date('2025-05-04'),
      },
    ];

    const insertedPrescriptions = await Prescription.insertMany(prescriptions);
    console.log('Prescriptions seeded:', insertedPrescriptions.length);

    // Create Vitals - 8 entries
    const vitals = [
      {
        patient: 'Alice Johnson',
        bp: '120/80',
        temp: '98.6',
        pulse: '72',
        createdAt: new Date('2025-05-05T09:00:00'),
      },
      {
        patient: 'Bob Miller',
        bp: '130/85',
        temp: '99.0',
        pulse: '80',
        createdAt: new Date('2025-05-05T10:00:00'),
      },
      {
        patient: 'Carol White',
        bp: '110/70',
        temp: '98.2',
        pulse: '68',
        createdAt: new Date('2025-05-05T11:00:00'),
      },
      {
        patient: 'David Thompson',
        bp: '135/88',
        temp: '99.1',
        pulse: '82',
        createdAt: new Date('2025-05-05T12:00:00'),
      },
      {
        patient: 'Emma Wilson',
        bp: '100/65',
        temp: '100.2',
        pulse: '90',
        createdAt: new Date('2025-05-05T13:00:00'),
      },
      {
        patient: 'Frank Chen',
        bp: '145/95',
        temp: '98.8',
        pulse: '78',
        createdAt: new Date('2025-05-05T14:00:00'),
      },
      {
        patient: 'Grace Kim',
        bp: '118/75',
        temp: '98.4',
        pulse: '70',
        createdAt: new Date('2025-05-05T15:00:00'),
      },
      {
        patient: 'Henry Davis',
        bp: '140/90',
        temp: '98.7',
        pulse: '75',
        createdAt: new Date('2025-05-05T16:00:00'),
      },
    ];

    const insertedVitals = await Vital.insertMany(vitals);
    console.log('Vitals seeded:', insertedVitals.length);

    // Create Medications - 8 entries
    const medications = [
      {
        patient: 'Alice Johnson',
        medication: 'Lisinopril',
        dosage: '10mg daily',
        schedule: '08:00 AM',
        createdAt: new Date('2025-05-01'),
      },
      {
        patient: 'Bob Miller',
        medication: 'Metformin',
        dosage: '500mg twice daily',
        schedule: '08:00 AM, 08:00 PM',
        createdAt: new Date('2025-05-02'),
      },
      {
        patient: 'Carol White',
        medication: 'Albuterol',
        dosage: '2 puffs as needed',
        schedule: 'As needed',
        createdAt: new Date('2025-05-01'),
      },
      {
        patient: 'David Thompson',
        medication: 'Sumatriptan',
        dosage: '50mg as needed',
        schedule: 'As needed',
        createdAt: new Date('2025-05-03'),
      },
      {
        patient: 'Emma Wilson',
        medication: 'Oseltamivir',
        dosage: '30mg twice daily',
        schedule: '09:00 AM, 09:00 PM',
        createdAt: new Date('2025-05-04'),
      },
      {
        patient: 'Frank Chen',
        medication: 'Atorvastatin',
        dosage: '20mg daily',
        schedule: '08:00 PM',
        createdAt: new Date('2025-05-02'),
      },
      {
        patient: 'Grace Kim',
        medication: 'Triamcinolone cream',
        dosage: 'Apply twice daily',
        schedule: '08:00 AM, 08:00 PM',
        createdAt: new Date('2025-05-03'),
      },
      {
        patient: 'Henry Davis',
        medication: 'Prednisolone eye drops',
        dosage: '1 drop 4 times daily',
        schedule: '08:00 AM, 12:00 PM, 04:00 PM, 08:00 PM',
        createdAt: new Date('2025-05-04'),
      },
    ];

    // If you have a Medication model
    const insertedMedications = await Medication.insertMany(medications);
    console.log('Medications seeded:', insertedMedications.length);

    // Create Tasks - 8 entries
    const tasks = [
      {
        name: 'Update patient records',
        priority: 'Medium',
        dueDate: '2025-05-08',
        status: 'In Progress',
        assignedTo: 'Bob Johnson',
        createdAt: new Date('2025-05-01'),
      },
      {
        name: 'Schedule MRI',
        priority: 'High',
        dueDate: '2025-05-07',
        status: 'Urgent',
        assignedTo: 'Lisa Davis',
        createdAt: new Date('2025-05-01'),
      },
      {
        name: 'Order lab supplies',
        priority: 'Medium',
        dueDate: '2025-05-10',
        status: 'Pending',
        assignedTo: 'Bob Johnson',
        createdAt: new Date('2025-05-02'),
      },
      {
        name: 'Prepare monthly report',
        priority: 'High',
        dueDate: '2025-05-15',
        status: 'In Progress',
        assignedTo: 'Lisa Davis',
        createdAt: new Date('2025-05-02'),
      },
      {
        name: 'Update department schedules',
        priority: 'Low',
        dueDate: '2025-05-09',
        status: 'Pending',
        assignedTo: 'Bob Johnson',
        createdAt: new Date('2025-05-03'),
      },
      {
        name: 'Coordinate staff meeting',
        priority: 'Medium',
        dueDate: '2025-05-11',
        status: 'In Progress',
        assignedTo: 'Lisa Davis',
        createdAt: new Date('2025-05-03'),
      },
      {
        name: 'Review insurance claims',
        priority: 'High',
        dueDate: '2025-05-08',
        status: 'Urgent',
        assignedTo: 'Bob Johnson',
        createdAt: new Date('2025-05-04'),
      },
      {
        name: 'Process patient discharges',
        priority: 'Medium',
        dueDate: '2025-05-07',
        status: 'Completed',
        assignedTo: 'Lisa Davis',
        createdAt: new Date('2025-05-04'),
      },
    ];

    const insertedTasks = await Task.insertMany(tasks);
    console.log('Tasks seeded:', insertedTasks.length);

    // Create Registrations - 8 entries
    const registrations = [
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Alice Johnson',
        date: '2025-05-01',
        department: 'Cardiology',
        status: 'Completed',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Bob Miller',
        date: '2025-05-02',
        department: 'Endocrinology',
        status: 'Pending',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Carol White',
        date: '2025-05-01',
        department: 'Pulmonology',
        status: 'Completed',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'David Thompson',
        date: '2025-05-03',
        department: 'Neurology',
        status: 'Completed',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Emma Wilson',
        date: '2025-05-04',
        department: 'Pediatrics',
        status: 'Completed',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Frank Chen',
        date: '2025-05-02',
        department: 'Cardiology',
        status: 'Completed',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Grace Kim',
        date: '2025-05-03',
        department: 'Dermatology',
        status: 'Pending',
      },
      {
        id: new mongoose.Types.ObjectId().toString(),
        patientName: 'Henry Davis',
        date: '2025-05-04',
        department: 'Ophthalmology',
        status: 'Pending',
      },
    ];

    const insertedRegistrations = await Registration.insertMany(registrations);
    console.log('Registrations seeded:', insertedRegistrations.length);

    // Create Appointments - 8 entries
    const appointments = [
      {
        patient: 'Alice Johnson',
        doctor: 'Dr. John Doe',
        time: '10:00',
        date: '2025-05-07',
        room: 'Room 101',
        visitType: 'Follow-up',
        createdAt: new Date('2025-05-01'),
      },
      {
        patient: 'Bob Miller',
        doctor: 'Dr. John Doe',
        time: '11:00',
        date: '2025-05-07',
        room: 'Room 102',
        visitType: 'New Patient',
        createdAt: new Date('2025-05-02'),
      },
      {
        patient: 'Carol White',
        doctor: 'Dr. John Doe',
        time: '13:00',
        date: '2025-05-08',
        room: 'Room 101',
        visitType: 'Follow-up',
        createdAt: new Date('2025-05-01'),
      },
      {
        patient: 'David Thompson',
        doctor: 'Dr. Jane Smith',
        time: '12:00',
        date: '2025-05-07',
        room: 'Room 201',
        visitType: 'Follow-up',
        createdAt: new Date('2025-05-03'),
      },
      {
        patient: 'Emma Wilson',
        doctor: 'Dr. Sarah Johnson',
        time: '09:30',
        date: '2025-05-07',
        room: 'Room 301',
        visitType: 'New Patient',
        createdAt: new Date('2025-05-04'),
      },
      {
        patient: 'Frank Chen',
        doctor: 'Dr. John Doe',
        time: '14:00',
        date: '2025-05-08',
        room: 'Room 103',
        visitType: 'Urgent',
        createdAt: new Date('2025-05-02'),
      },
      {
        patient: 'Grace Kim',
        doctor: 'Dr. Emily Rodriguez',
        time: '15:00',
        date: '2025-05-07',
        room: 'Room 401',
        visitType: 'Follow-up',
        createdAt: new Date('2025-05-03'),
      },
      {
        patient: 'Henry Davis',
        doctor: 'Dr. Robert Wilson',
        time: '09:30',
        date: '2025-05-07',
        room: 'Room 501',
        visitType: 'Pre-Op',
        createdAt: new Date('2025-05-04'),
      },
    ];

    const insertedAppointments = await Appointment.insertMany(appointments);
    console.log('Appointments seeded:', insertedAppointments.length);

    console.log('Database seeding completed successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedData();
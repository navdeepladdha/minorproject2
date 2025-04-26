// src/services/api.js
const mockUsers = [
    { username: "doctor1", password: "password1", role: "doctor", name: "Dr. John Smith" },
    { username: "nurse1", password: "password1", role: "nurse", name: "Nancy Brown" },
    { username: "admin1", password: "password1", role: "admin", name: "Admin User" },
    { username: "staff1", password: "password1", role: "staff", name: "Staff Member" }
  ];
  
  export const loginUser = async (username, password, role) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
  
    // Find user with matching credentials
    const user = mockUsers.find(
      user => user.username === username && 
              user.password === password &&
              (role ? user.role === role : true)
    );
  
    if (user) {
      return {
        success: true,
        user: {
          username: user.username,
          role: user.role,
          name: user.name
        }
      };
    } else {
      throw new Error("Invalid credentials or role");
    }
  };
  
  // You can add more API functions here for different role-based operations
  export const fetchDoctorData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      patients: [
        { id: 1, name: "Alice Johnson", age: 45, diagnosis: "Hypertension" },
        { id: 2, name: "Bob Miller", age: 32, diagnosis: "Diabetes" },
        { id: 3, name: "Carol Davis", age: 28, diagnosis: "Asthma" }
      ],
      appointments: [
        { id: 1, patient: "Alice Johnson", time: "10:00 AM", date: "2025-04-19" },
        { id: 2, patient: "Bob Miller", time: "11:30 AM", date: "2025-04-19" }
      ]
    };
  };
  
  export const fetchNurseData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      patientVitals: [
        { patient: "Alice Johnson", bp: "120/80", temp: "98.6°F", pulse: 72 },
        { patient: "Bob Miller", bp: "130/85", temp: "99.1°F", pulse: 75 }
      ],
      medications: [
        { patient: "Alice Johnson", medication: "Lisinopril", dosage: "10mg", schedule: "Daily" },
        { patient: "Bob Miller", medication: "Metformin", dosage: "500mg", schedule: "Twice daily" }
      ]
    };
  };
  
  export const fetchAdminData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      users: mockUsers.map(u => ({ username: u.username, role: u.role, name: u.name })),
      systemStats: {
        activeUsers: 24,
        patientsToday: 45,
        pendingTasks: 12
      }
    };
  };
  
  export const fetchStaffData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      appointments: [
        { id: 1, patient: "Alice Johnson", doctor: "Dr. John Smith", time: "10:00 AM", date: "2025-04-19" },
        { id: 2, patient: "Bob Miller", doctor: "Dr. John Smith", time: "11:30 AM", date: "2025-04-19" },
        { id: 3, patient: "Carol Davis", doctor: "Dr. Sarah Jones", time: "2:15 PM", date: "2025-04-19" }
      ],
      registrations: [
        { id: 101, name: "David Wilson", date: "2025-04-18", insurance: "Blue Cross" },
        { id: 102, name: "Eva Martinez", date: "2025-04-18", insurance: "Aetna" }
      ]
    };
  };
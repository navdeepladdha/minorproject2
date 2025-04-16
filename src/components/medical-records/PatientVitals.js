import { useState, useEffect } from 'react';

/**
 * PatientVitals component displays and manages patient vital signs
 * @param {Object} props
 * @param {string} props.patientId - The ID of the current patient
 * @param {Object} props.onVitalUpdate - Callback function when vitals are updated
 * @param {boolean} props.readOnly - Whether the component should be in read-only mode
 */
const PatientVitals = ({ patientId, onVitalUpdate, readOnly = false }) => {
  // State for vitals data
  const [vitals, setVitals] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    heartRate: '',
    respiratoryRate: '',
    temperature: '',
    oxygenSaturation: '',
    painLevel: '',
    height: '',
    weight: '',
    bmi: '',
    timestamp: new Date().toISOString()
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch patient vitals on component mount or when patientId changes
  useEffect(() => {
    if (!patientId) return;
    
    const fetchVitals = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/patients/${patientId}/vitals`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch vitals data');
        }
        
        const data = await response.json();
        
        if (data && data.latestVitals) {
          setVitals(data.latestVitals);
        }
      } catch (err) {
        console.error('Error fetching vitals:', err);
        setError('Unable to load patient vitals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVitals();
  }, [patientId]);

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (vitals.height && vitals.weight) {
      // BMI formula: weight (kg) / (height (m))^2
      const heightInMeters = parseFloat(vitals.height) / 100;
      const weightInKg = parseFloat(vitals.weight);
      
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setVitals(prev => ({
          ...prev,
          bmi
        }));
      }
    }
  }, [vitals.height, vitals.weight]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'systolic' || name === 'diastolic') {
      setVitals(prev => ({
        ...prev,
        bloodPressure: {
          ...prev.bloodPressure,
          [name]: value
        }
      }));
    } else {
      setVitals(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (readOnly) return;
    
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Update timestamp
      const updatedVitals = {
        ...vitals,
        timestamp: new Date().toISOString()
      };
      
      // Replace with your actual API endpoint
      const response = await fetch(`/api/patients/${patientId}/vitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedVitals)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save vitals data');
      }
      
      // Call the callback function if provided
      if (onVitalUpdate) {
        onVitalUpdate(updatedVitals);
      }
      
      setSuccessMessage('Vitals successfully updated');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving vitals:', err);
      setError('Unable to save vitals. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Patient Vitals</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-gray-500">Loading vitals data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">
        Patient Vitals
        {!readOnly && <span className="text-sm font-normal text-gray-500 ml-2">(Editable)</span>}
      </h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-2 bg-green-50 text-green-700 border border-green-200 rounded">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blood Pressure */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure (mmHg)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                name="systolic"
                value={vitals.bloodPressure.systolic}
                onChange={handleChange}
                placeholder="Systolic"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={readOnly}
                min="50"
                max="250"
              />
              <span className="mx-2 text-gray-500">/</span>
              <input
                type="number"
                name="diastolic"
                value={vitals.bloodPressure.diastolic}
                onChange={handleChange}
                placeholder="Diastolic"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={readOnly}
                min="30"
                max="150"
              />
            </div>
          </div>
          
          {/* Heart Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="heartRate"
              value={vitals.heartRate}
              onChange={handleChange}
              placeholder="60-100"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="30"
              max="250"
            />
          </div>
          
          {/* Respiratory Rate */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Respiratory Rate (breaths/min)
            </label>
            <input
              type="number"
              name="respiratoryRate"
              value={vitals.respiratoryRate}
              onChange={handleChange}
              placeholder="12-20"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="8"
              max="40"
            />
          </div>
          
          {/* Temperature */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              name="temperature"
              value={vitals.temperature}
              onChange={handleChange}
              placeholder="36.5-37.5"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="35"
              max="42"
              step="0.1"
            />
          </div>
          
          {/* Oxygen Saturation */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oxygen Saturation (%)
            </label>
            <input
              type="number"
              name="oxygenSaturation"
              value={vitals.oxygenSaturation}
              onChange={handleChange}
              placeholder="95-100"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="70"
              max="100"
            />
          </div>
          
          {/* Pain Level */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pain Level (0-10)
            </label>
            <input
              type="number"
              name="painLevel"
              value={vitals.painLevel}
              onChange={handleChange}
              placeholder="0-10"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="0"
              max="10"
            />
          </div>
          
          {/* Height */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={vitals.height}
              onChange={handleChange}
              placeholder="Height in cm"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="50"
              max="250"
            />
          </div>
          
          {/* Weight */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={vitals.weight}
              onChange={handleChange}
              placeholder="Weight in kg"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={readOnly}
              min="1"
              max="300"
              step="0.1"
            />
          </div>
          
          {/* BMI - Calculated field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BMI
            </label>
            <input
              type="text"
              value={vitals.bmi || 'Calculated from height and weight'}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>
          
          {/* Last Updated */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Updated
            </label>
            <input
              type="text"
              value={new Date(vitals.timestamp).toLocaleString()}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>
        </div>
        
        {!readOnly && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {saving ? 'Saving...' : 'Save Vitals'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientVitals;
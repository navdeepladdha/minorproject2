import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';

const MedicalRecordDetails = ({ recordId, patientId, onClose }) => {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  
  // Use params if recordId is not directly provided
  const currentRecordId = recordId || params.recordId;
  const currentPatientId = patientId || params.patientId;

  useEffect(() => {
    if (!currentRecordId || !currentPatientId) return;
    
    const fetchMedicalRecord = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/patients/${currentPatientId}/medical-records/${currentRecordId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch medical record details');
        }
        
        const data = await response.json();
        setRecord(data);
      } catch (err) {
        console.error('Error fetching medical record:', err);
        setError('Unable to load medical record details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalRecord();
  }, [currentRecordId, currentPatientId]);

  const handleBackClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`/patients/${currentPatientId}/medical-records`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Medical Record Details</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-gray-500">Loading medical record details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Medical Record Details</h2>
        <div className="p-4 text-red-600 bg-red-50 rounded">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Medical Record Details</h2>
        <div className="p-4 text-gray-500 bg-gray-50 rounded">
          Record not found.
        </div>
        <div className="mt-4">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Medical Record Details</h2>
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back to Records
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 mb-6 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Record ID</p>
            <p className="font-medium">{record.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(record.date, true)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Record Type</p>
            <p className="font-medium">{record.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${record.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}>
                {record.status}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Provider Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Provider Name</p>
              <p className="font-medium">{record.providerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{record.departmentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Facility</p>
              <p className="font-medium">{record.facilityName}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Chief Complaint</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p>{record.chiefComplaint || 'No chief complaint documented.'}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Diagnosis</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          {record.diagnoses && record.diagnoses.length > 0 ? (
            <ul className="list-disc pl-5">
              {record.diagnoses.map((diagnosis, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">{diagnosis.code}</span> - {diagnosis.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No diagnoses documented.</p>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Assessment</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p>{record.assessment || 'No assessment documented.'}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Plan</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p>{record.plan || 'No plan documented.'}</p>
        </div>
      </div>
      
      {record.followUpDate && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Follow-up</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p>Scheduled for {formatDate(record.followUpDate)}</p>
            {record.followUpNotes && <p className="mt-2">{record.followUpNotes}</p>}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-2">Notes</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p>{record.notes || 'No additional notes.'}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetails;
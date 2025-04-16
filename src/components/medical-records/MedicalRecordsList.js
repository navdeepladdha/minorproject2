import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getRelativeTimeString } from '../../utils/dateUtils';

const MedicalRecordsList = ({ patientId, limit, onRecordSelect }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  useEffect(() => {
    if (!patientId) return;
    
    const fetchMedicalRecords = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/patients/${patientId}/medical-records${limit ? `?limit=${limit}` : ''}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch medical records');
        }
        
        const data = await response.json();
        setRecords(data.records || []);
      } catch (err) {
        console.error('Error fetching medical records:', err);
        setError('Unable to load medical records. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalRecords();
  }, [patientId, limit]);

  const handleRecordClick = (recordId) => {
    setSelectedRecordId(recordId);
    if (onRecordSelect) {
      onRecordSelect(recordId);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-gray-500">Loading medical records...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
        <div className="p-4 text-red-600 bg-red-50 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="p-4 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
        <div className="p-4 text-gray-500 bg-gray-50 rounded">
          No medical records found for this patient.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">
        Medical Records
        {limit && records.length >= limit && (
          <Link to={`/patients/${patientId}/medical-records`} className="text-sm text-blue-600 ml-2 font-normal">
            View All
          </Link>
        )}
      </h2>
      
      <div className="overflow-hidden border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Provider
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr 
                key={record.id} 
                onClick={() => handleRecordClick(record.id)}
                className={`cursor-pointer hover:bg-gray-50 ${selectedRecordId === record.id ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatDate(record.date, true)}</div>
                  <div className="text-sm text-gray-500">{getRelativeTimeString(record.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.providerName}</div>
                  <div className="text-sm text-gray-500">{record.departmentName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${record.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                    record.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalRecordsList;
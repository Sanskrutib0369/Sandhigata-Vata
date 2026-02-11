import React, { useState } from 'react';
import { Patient } from '../types';
import { User, Calendar, Activity, ChevronRight, Trash2, Search } from 'lucide-react';
import { diagnoseSandhigataVata } from '../services/diagnosisService';
import { searchPatients } from '../services/storageService';
import StorageStatus from './StorageStatus';

interface PatientListProps {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  storageRefreshTrigger?: number;
}

const PatientList: React.FC<PatientListProps> = ({ patients, onSelect, onDelete, onNew, storageRefreshTrigger }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter patients based on search
  const filteredPatients = searchQuery ? searchPatients(searchQuery) : patients;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <StorageStatus refreshTrigger={storageRefreshTrigger} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-ayur-900">Patient Records</h1>
            <p className="text-gray-500 mt-1">Diagnosing Sandhigata Vata</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name, ID, OPD number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500 focus:border-transparent w-full sm:w-80"
                />
            </div>
            <button 
                onClick={onNew}
                className="bg-ayur-600 hover:bg-ayur-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center font-semibold transition-all hover:scale-105 whitespace-nowrap"
            >
                <span className="text-xl mr-2">+</span> New Diagnosis
            </button>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-ayur-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-ayur-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">
              {searchQuery ? 'No patients found' : 'No records found'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No patients match "${searchQuery}". Try a different search term.` 
                : 'Start by adding a new patient for diagnosis.'
              }
            </p>
            <button 
              onClick={searchQuery ? () => setSearchQuery('') : onNew} 
              className="text-ayur-600 font-bold hover:underline"
            >
              {searchQuery ? 'Clear search' : 'Create First Record'}
            </button>
        </div>
      ) : (
        <div>
          {searchQuery && (
            <div className="mb-4 text-sm text-gray-600">
              Found {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} matching "{searchQuery}"
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-2 text-ayur-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(patient => {
                const diagnosis = diagnoseSandhigataVata(patient);
                return (
                <div key={patient.id} className={`rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:scale-105 ${
                    diagnosis.isPositive 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
                }`}>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                                    diagnosis.isPositive 
                                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                        : 'bg-gradient-to-br from-red-500 to-pink-600'
                                }`}>
                                    {patient.demographics.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 truncate max-w-[150px] text-lg">{patient.demographics.name}</h3>
                                    <p className="text-xs text-gray-600 font-medium">{patient.demographics.age} Y • {patient.demographics.gender}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm ${
                                diagnosis.isPositive
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                                {patient.demographics.opdIpdNo || 'OPD'}
                            </span>
                        </div>
                        
                        <div className="mb-4">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${diagnosis.isPositive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {diagnosis.isPositive ? 'POSITIVE' : 'NEGATIVE'}
                            </span>
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-gray-700">
                                <Calendar className="w-4 h-4 mr-2 text-ayur-500" />
                                <span className="font-medium">{new Date(patient.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Activity className="w-4 h-4 mr-2 text-ayur-500" />
                                <span className="truncate font-medium">Pain VAS: </span>
                                <span className={`font-bold ml-1 px-2 py-0.5 rounded-full text-xs ${
                                    patient.symptoms.painIntensity > 7 
                                        ? 'bg-red-100 text-red-700' 
                                        : patient.symptoms.painIntensity > 4 
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                                }`}>
                                    {patient.symptoms.painIntensity}/10
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                            {patient.affectedJoints.slice(0, 3).map(j => (
                                <span key={j} className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                                    diagnosis.isPositive
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                    {j}
                                </span>
                            ))}
                            {patient.affectedJoints.length > 3 && 
                                <span className="text-xs text-gray-500 pl-1 font-medium">+{patient.affectedJoints.length - 3} more</span>
                            }
                        </div>
                    </div>
                    
                    <div className={`px-5 py-3 border-t flex justify-between items-center ${
                        diagnosis.isPositive 
                            ? 'bg-green-100 border-green-200' 
                            : 'bg-red-100 border-red-200'
                    }`}>
                         <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(patient.id); }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => onSelect(patient)}
                            className={`text-sm font-bold flex items-center group-hover:translate-x-1 transition-all px-3 py-1 rounded-full ${
                                diagnosis.isPositive
                                    ? 'text-green-700 hover:bg-green-200'
                                    : 'text-red-700 hover:bg-red-200'
                            }`}
                        >
                            View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            )})}
        </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;

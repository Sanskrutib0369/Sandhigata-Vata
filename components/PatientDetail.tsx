import React from 'react';
import { Patient } from '../types';
import BodyMap from './BodyMap';
import VasScale from './VasScale';
import { ArrowLeft, User, Printer, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { checkCriteria } from '../services/diagnosisService';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  // Run diagnosis algorithm to get detailed criteria checks
  const diagnosis = checkCriteria(patient);

  const DetailRow = ({ label, value, isValid }: { label: string, value: string | undefined, isValid?: boolean }) => (
    <div className={`p-4 rounded-lg border ${isValid === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
        <span className="block text-xs text-gray-500 uppercase font-bold mb-1">{label}</span>
        <span className={`text-md font-medium ${isValid === false ? 'text-red-700' : 'text-gray-800'}`}>
            {value || 'N/A'} {isValid === false && "(Invalid)"}
        </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <button onClick={onBack} className="mb-6 flex items-center text-gray-500 hover:text-ayur-600 transition-colors font-medium">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-ayur-600 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-bold mb-2">{patient.demographics.name}</h1>
                <div className="flex flex-wrap gap-4 text-ayur-100 text-sm">
                    <span className="flex items-center"><User className="w-4 h-4 mr-1"/> {patient.demographics.age} Years, {patient.demographics.gender}</span>
                    <span className="opacity-75">ID: {patient.demographics.opdIpdNo || 'N/A'}</span>
                    <span className="opacity-75">Date: {new Date(patient.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <button onClick={() => window.print()} className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center text-sm font-semibold transition-colors">
                <Printer className="w-4 h-4 mr-2" /> Print Record
            </button>
        </div>

        {/* Diagnostic Result Banner */}
        <div className={`p-6 border-b ${diagnosis.isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start">
                {diagnosis.isPositive ? (
                    <CheckCircle className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                ) : (
                    <XCircle className="w-8 h-8 text-red-600 mt-1 flex-shrink-0" />
                )}
                <div className="ml-4">
                    <h2 className={`text-xl font-bold ${diagnosis.isPositive ? 'text-green-800' : 'text-red-800'}`}>
                        {diagnosis.isPositive ? "Positive for Sandhigata Vata" : "Negative for Sandhigata Vata"}
                    </h2>
                    <p className={`text-sm mt-1 ${diagnosis.isPositive ? 'text-green-700' : 'text-red-700'}`}>
                        {diagnosis.isPositive 
                            ? "All strict diagnostic criteria for Sandhigata Vata are met."
                            : "The patient does not meet all criteria. Failed criteria are highlighted in red below."}
                    </p>
                    {!diagnosis.isPositive && diagnosis.reasons.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-bold text-red-800 uppercase mb-1">Unmet Criteria Summary:</p>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {diagnosis.reasons.map((r, i) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column: Clinical Info */}
            <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
                
                {/* Questionnaire Data */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Questionnaire Responses</h2>
                    
                    {/* Q1 */}
                    <div className={`mb-6 p-4 rounded-lg border ${(!diagnosis.criteria.jointPain || !diagnosis.criteria.onset) ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                        <label className="text-sm font-semibold text-gray-500 mb-2 block">1. Pain Intensity</label>
                        <VasScale value={patient.symptoms.painIntensity} onChange={() => {}} readOnly />
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                             <div className={diagnosis.criteria.jointPain ? '' : 'text-red-600 font-bold'}>
                                 <span className="text-gray-500">Joint Pain:</span> {patient.symptoms.hasJointPain}
                             </div>
                             <div>
                                 <span className="text-gray-500">Duration:</span> {patient.symptoms.painDuration}
                             </div>
                             <div className={diagnosis.criteria.onset ? '' : 'text-red-600 font-bold'}>
                                 <span className="text-gray-500">Onset:</span> {patient.symptoms.painOnset}
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <DetailRow 
                            label="2. Type of Pain" 
                            value={patient.symptoms.painTypes.join(', ')} 
                            isValid={diagnosis.criteria.painType}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <DetailRow 
                                label="3. Swelling" 
                                value={`${patient.symptoms.swelling} ${patient.symptoms.swelling !== 'Never' ? `(Since: ${patient.symptoms.swellingDuration})` : ''}`} 
                                isValid={diagnosis.criteria.swelling}
                            />
                            <DetailRow 
                                label="4. Stiffness" 
                                value={`${patient.symptoms.stiffness} ${patient.symptoms.stiffness === 'Yes' ? `(${patient.symptoms.stiffnessDuration})` : ''}`} 
                                isValid={diagnosis.criteria.stiffness}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <DetailRow label="5. Crepitus" value={patient.symptoms.crepitus} isValid={diagnosis.criteria.crepitus} />
                             <DetailRow label="6. Shifting Pain" value={patient.symptoms.shiftingPain} isValid={diagnosis.criteria.shiftingPain} />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                             <DetailRow label="7. Warmth" value={patient.symptoms.warmth} isValid={diagnosis.criteria.warmth} />
                             <DetailRow label="8. Fever" value={patient.symptoms.fever} isValid={diagnosis.criteria.fever} />
                             <DetailRow label="9. Discoloration" value={patient.symptoms.discoloration} isValid={diagnosis.criteria.discoloration} />
                        </div>

                        <DetailRow label="10. Oil/Massage Effect" value={patient.symptoms.oilMassageEffect} isValid={diagnosis.criteria.oilEffect} />
                    </div>
                </section>

                {/* Labs Section */}
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Laboratory & Imaging</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {Object.entries(patient.labs).filter(([k]) => k !== 'xrayImage' && k !== 'xrayReport' && k !== 'other').map(([key, val]) => (
                            val && (
                                <div key={key} className="p-3 border rounded">
                                    <span className="block text-xs text-gray-500 uppercase font-bold mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-mono text-gray-800">{val}</span>
                                </div>
                            )
                        ))}
                    </div>
                    {patient.labs.xrayImage && (
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-gray-600 mb-2">X-Ray Image</p>
                            <img src={patient.labs.xrayImage} alt="Xray" className="max-h-64 rounded-lg border shadow-sm" />
                            {patient.labs.xrayReport && <p className="text-xs text-gray-500 mt-2">File: {patient.labs.xrayReport}</p>}
                        </div>
                    )}
                </section>

                {/* Body Map Section */}
                <section>
                    <h3 className={`font-bold text-center mb-4 ${diagnosis.criteria.affectedJoints ? 'text-gray-700' : 'text-red-600'}`}>
                        Affected Joints (Q11)
                        {!diagnosis.criteria.affectedJoints && <span className="block text-xs font-normal mt-1">(Must include Knee, Spine, or Hip)</span>}
                    </h3>
                    <div className={`bg-white rounded-xl shadow-sm p-2 ${diagnosis.criteria.affectedJoints ? '' : 'border-2 border-red-300'}`}>
                        <BodyMap selectedJoints={patient.affectedJoints} onChange={() => {}} readOnly />
                    </div>
                </section>

                {/* Patient Details */}
                <section>
                    <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Patient Details</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase">Address</span>
                            <span className="font-medium text-gray-800">{patient.demographics.address || 'N/A'}</span>
                        </div>
                         <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase">Occupation</span>
                            <span className="font-medium text-gray-800">{patient.demographics.occupation || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs uppercase">Contact</span>
                            <span className="font-medium text-gray-800">{patient.demographics.contact || 'N/A'}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;

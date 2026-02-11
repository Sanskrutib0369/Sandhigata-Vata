import React from 'react';
import { Patient } from '../types';
import BodyMap from './BodyMap';
import VasScale from './VasScale';
import { ArrowLeft, User, Printer, AlertCircle, CheckCircle, XCircle, Calendar, Phone, MapPin, Briefcase, Activity, FileText } from 'lucide-react';
import { checkCriteria } from '../services/diagnosisService';

const printStyles = `
  @media print {
    .no-print {
      display: none !important;
    }
    
    .print-header {
      background: linear-gradient(135deg, #2d6e2d 0%, #4a9d4a 100%) !important;
      color: white !important;
      padding: 20px !important;
      border-radius: 8px !important;
      margin-bottom: 20px !important;
      page-break-after: avoid !important;
    }
    
    .print-section {
      margin-bottom: 25px !important;
      page-break-inside: avoid !important;
    }
    
    .print-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 15px !important;
      margin-bottom: 20px !important;
    }
    
    .print-criteria {
      border: 2px solid #e5e7eb !important;
      border-radius: 8px !important;
      padding: 15px !important;
      margin-bottom: 10px !important;
      background: #f9fafb !important;
    }
    
    .print-criteria.valid {
      border-color: #10b981 !important;
      background: #ecfdf5 !important;
    }
    
    .print-criteria.invalid {
      border-color: #ef4444 !important;
      background: #fef2f2 !important;
    }
    
    .print-diagnosis {
      text-align: center !important;
      padding: 20px !important;
      border-radius: 8px !important;
      margin: 20px 0 !important;
      page-break-inside: avoid !important;
    }
    
    .print-diagnosis.positive {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      color: white !important;
    }
    
    .print-diagnosis.negative {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      color: white !important;
    }
    
    .print-footer {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      text-align: center !important;
      font-size: 10px !important;
      color: #6b7280 !important;
      padding: 10px !important;
      border-top: 1px solid #e5e7eb !important;
    }
    
    .print-badge {
      display: inline-block !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 11px !important;
      font-weight: bold !important;
      margin-right: 5px !important;
    }
    
    .print-badge.valid {
      background: #10b981 !important;
      color: white !important;
    }
    
    .print-badge.invalid {
      background: #ef4444 !important;
      color: white !important;
    }
    
    .print-lab-grid {
      display: grid !important;
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 10px !important;
      margin-bottom: 20px !important;
    }
    
    .print-lab-item {
      border: 1px solid #e5e7eb !important;
      border-radius: 6px !important;
      padding: 10px !important;
      background: #f9fafb !important;
    }
    
    @page {
      margin: 15mm;
      size: A4;
      @top-center {
        content: "Sandhigata Vata Diagnosis Report";
        font-size: 10pt;
        color: #2d6e2d;
      }
      @bottom-center {
        content: "Page " counter(page);
        font-size: 8pt;
        color: #666;
      }
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    body {
      font-size: 11pt !important;
      line-height: 1.4 !important;
      color: #000 !important;
      background: #fff !important;
      margin: 0 !important;
      padding: 15pt !important;
    }
    
    h1 { font-size: 18pt !important; margin-bottom: 10pt !important; }
    h2 { font-size: 14pt !important; margin-bottom: 8pt !important; }
    h3 { font-size: 12pt !important; margin-bottom: 6pt !important; }
  }
`;

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

  const generatePrintContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sandhigata Vata Diagnosis Report - ${patient.demographics.name}</title>
        <style>
          ${printStyles}
        </style>
      </head>
      <body>
        <div class="print-header">
          <h1 style="margin: 0; font-size: 20pt; font-weight: bold;">${patient.demographics.name}</h1>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; font-size: 11pt;">
            <div><strong>Age:</strong> ${patient.demographics.age} Years</div>
            <div><strong>Gender:</strong> ${patient.demographics.gender}</div>
            <div><strong>ID:</strong> ${patient.demographics.opdIpdNo || 'N/A'}</div>
            <div><strong>Date:</strong> ${new Date(patient.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="print-diagnosis ${diagnosis.isPositive ? 'positive' : 'negative'}">
          <h2 style="margin: 0; font-size: 16pt; font-weight: bold;">
            ${diagnosis.isPositive ? '✅ POSITIVE' : '❌ NEGATIVE'} for Sandhigata Vata
          </h2>
          <p style="margin: 10px 0 0 0; font-size: 12pt;">
            ${diagnosis.isPositive 
              ? 'All strict diagnostic criteria for Sandhigata Vata are met.' 
              : 'The patient does not meet all criteria for Sandhigata Vata.'}
          </p>
        </div>

        <div class="print-section">
          <h2 style="margin: 0 0 15px 0; font-size: 14pt; font-weight: bold; border-bottom: 2px solid #2d6e2d; padding-bottom: 5px;">
            📋 Diagnostic Criteria Assessment
          </h2>
          
          <div class="print-criteria ${diagnosis.criteria.jointPain ? 'valid' : 'invalid'}">
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <span class="print-badge ${diagnosis.criteria.jointPain ? 'valid' : 'invalid'}">
                ${diagnosis.criteria.jointPain ? '✓' : '✗'}
              </span>
              <strong>1. Joint Pain Present:</strong> ${patient.symptoms.hasJointPain}
            </div>
            <div style="font-size: 10pt; color: #666;">
              Duration: ${patient.symptoms.painDuration} | Onset: ${patient.symptoms.painOnset}
            </div>
          </div>

          <div class="print-criteria ${diagnosis.criteria.painType ? 'valid' : 'invalid'}">
            <div style="display: flex; align-items: center;">
              <span class="print-badge ${diagnosis.criteria.painType ? 'valid' : 'invalid'}">
                ${diagnosis.criteria.painType ? '✓' : '✗'}
              </span>
              <strong>2. Pain Type:</strong> ${patient.symptoms.painTypes.join(', ')}
            </div>
          </div>

          <div class="print-grid">
            <div class="print-criteria ${diagnosis.criteria.swelling ? 'valid' : 'invalid'}">
              <div style="display: flex; align-items: center;">
                <span class="print-badge ${diagnosis.criteria.swelling ? 'valid' : 'invalid'}">
                  ${diagnosis.criteria.swelling ? '✓' : '✗'}
                </span>
                <strong>3. Swelling:</strong> ${patient.symptoms.swelling}
              </div>
              ${patient.symptoms.swellingDuration ? `<div style="font-size: 10pt; color: #666;">Since: ${patient.symptoms.swellingDuration}</div>` : ''}
            </div>

            <div class="print-criteria ${diagnosis.criteria.stiffness ? 'valid' : 'invalid'}">
              <div style="display: flex; align-items: center;">
                <span class="print-badge ${diagnosis.criteria.stiffness ? 'valid' : 'invalid'}">
                  ${diagnosis.criteria.stiffness ? '✓' : '✗'}
                </span>
                <strong>4. Stiffness:</strong> ${patient.symptoms.stiffness}
              </div>
              ${patient.symptoms.stiffnessDuration ? `<div style="font-size: 10pt; color: #666;">Duration: ${patient.symptoms.stiffnessDuration}</div>` : ''}
            </div>
          </div>

          <div class="print-grid">
            <div class="print-criteria ${diagnosis.criteria.crepitus ? 'valid' : 'invalid'}">
              <div style="display: flex; align-items: center;">
                <span class="print-badge ${diagnosis.criteria.crepitus ? 'valid' : 'invalid'}">
                  ${diagnosis.criteria.crepitus ? '✓' : '✗'}
                </span>
                <strong>5. Crepitus:</strong> ${patient.symptoms.crepitus}
              </div>
            </div>

            <div class="print-criteria ${diagnosis.criteria.shiftingPain ? 'valid' : 'invalid'}">
              <div style="display: flex; align-items: center;">
                <span class="print-badge ${diagnosis.criteria.shiftingPain ? 'valid' : 'invalid'}">
                  ${diagnosis.criteria.shiftingPain ? '✓' : '✗'}
                </span>
                <strong>6. Shifting Pain:</strong> ${patient.symptoms.shiftingPain}
              </div>
            </div>
          </div>

          <div class="print-grid">
            <div class="print-criteria ${diagnosis.criteria.warmth ? 'valid' : 'invalid'}">
              <div style="display: flex; align-items: center;">
                <span class="print-badge ${diagnosis.criteria.warmth ? 'valid' : 'invalid'}">
                  ${diagnosis.criteria.warmth ? '✓' : '✗'}
                </span>
                <strong>7. Warmth:</strong> ${patient.symptoms.warmth}
              </div>
            </div>

            <div class="print-criteria ${diagnosis.criteria.fever ? 'valid' : 'invalid'}">
              <div style="display: flex; align-items: center;">
                <span class="print-badge ${diagnosis.criteria.fever ? 'valid' : 'invalid'}">
                  ${diagnosis.criteria.fever ? '✓' : '✗'}
                </span>
                <strong>8. Fever:</strong> ${patient.symptoms.fever}
              </div>
            </div>
          </div>

          <div class="print-criteria ${diagnosis.criteria.discoloration ? 'valid' : 'invalid'}">
            <div style="display: flex; align-items: center;">
              <span class="print-badge ${diagnosis.criteria.discoloration ? 'valid' : 'invalid'}">
                ${diagnosis.criteria.discoloration ? '✓' : '✗'}
              </span>
              <strong>9. Discoloration:</strong> ${patient.symptoms.discoloration}
            </div>
          </div>

          <div class="print-criteria ${diagnosis.criteria.oilEffect ? 'valid' : 'invalid'}">
            <div style="display: flex; align-items: center;">
              <span class="print-badge ${diagnosis.criteria.oilEffect ? 'valid' : 'invalid'}">
                ${diagnosis.criteria.oilEffect ? '✓' : '✗'}
              </span>
              <strong>10. Oil/Massage Effect:</strong> ${patient.symptoms.oilMassageEffect}
            </div>
          </div>

          <div class="print-criteria ${diagnosis.criteria.affectedJoints ? 'valid' : 'invalid'}">
            <div style="display: flex; align-items: center;">
              <span class="print-badge ${diagnosis.criteria.affectedJoints ? 'valid' : 'invalid'}">
                ${diagnosis.criteria.affectedJoints ? '✓' : '✗'}
              </span>
              <strong>11. Affected Joints:</strong> ${patient.affectedJoints.join(', ')}
            </div>
            <div style="font-size: 10pt; color: #666; margin-top: 5px;">
              ${!diagnosis.criteria.affectedJoints ? 'Must include Knee, Spine, or Hip for positive diagnosis' : 'Required joints affected'}
            </div>
          </div>
        </div>

        ${Object.entries(patient.labs).filter(([k]) => k !== 'xrayImage' && k !== 'xrayReport' && k !== 'other').length > 0 ? `
        <div class="print-section">
          <h2 style="margin: 0 0 15px 0; font-size: 14pt; font-weight: bold; border-bottom: 2px solid #2d6e2d; padding-bottom: 5px;">
            🧪 Laboratory Results
          </h2>
          <div class="print-lab-grid">
            ${Object.entries(patient.labs).filter(([k]) => k !== 'xrayImage' && k !== 'xrayReport' && k !== 'other').map(([key, val]) => `
              <div class="print-lab-item">
                <div style="font-size: 10pt; color: #666; margin-bottom: 3px;">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div style="font-weight: bold;">${val || 'N/A'}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <div class="print-section">
          <h2 style="margin: 0 0 15px 0; font-size: 14pt; font-weight: bold; border-bottom: 2px solid #2d6e2d; padding-bottom: 5px;">
            👤 Patient Information
          </h2>
          <div class="print-grid">
            <div>
              <div style="font-size: 10pt; color: #666; margin-bottom: 3px;">📍 Address</div>
              <div style="font-weight: bold;">${patient.demographics.address || 'N/A'}</div>
            </div>
            <div>
              <div style="font-size: 10pt; color: #666; margin-bottom: 3px;">💼 Occupation</div>
              <div style="font-weight: bold;">${patient.demographics.occupation || 'N/A'}</div>
            </div>
            <div>
              <div style="font-size: 10pt; color: #666; margin-bottom: 3px;">📞 Contact</div>
              <div style="font-weight: bold;">${patient.demographics.contact || 'N/A'}</div>
            </div>
            <div>
              <div style="font-size: 10pt; color: #666; margin-bottom: 3px;">📅 Assessment Date</div>
              <div style="font-weight: bold;">${new Date(patient.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div class="print-footer">
          Sandhigata Vata Diagnosis Report | Generated on ${new Date().toLocaleDateString()} | Page <span class="page-number"></span>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(generatePrintContent());
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <button onClick={onBack} className="mb-6 flex items-center text-gray-500 hover:text-ayur-600 transition-colors font-medium no-print">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-ayur-600 to-green-700 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center print-header">
            <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <User className="w-8 h-8 mr-3" />
                  {patient.demographics.name}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-ayur-100 text-sm">
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2"/> {patient.demographics.age} Years, {patient.demographics.gender}</span>
                    <span className="flex items-center"><FileText className="w-4 h-4 mr-2"/> ID: {patient.demographics.opdIpdNo || 'N/A'}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-2"/> Date: {new Date(patient.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center"><Activity className="w-4 h-4 mr-2"/> Pain Level: {patient.symptoms.painIntensity}/10</span>
                </div>
            </div>
            <button onClick={handlePrint} className="mt-4 md:mt-0 bg-white text-ayur-600 hover:bg-ayur-50 px-6 py-3 rounded-lg flex items-center text-sm font-semibold transition-colors shadow-lg no-print">
                <Printer className="w-5 h-5 mr-2" /> Print Report
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

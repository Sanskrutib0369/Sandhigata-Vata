import React from 'react';
import { Patient } from '../types';
import BodyMap from './BodyMap';
import VasScale from './VasScale';
import { ArrowLeft, User, Printer as PrinterIcon, CheckCircle, XCircle } from 'lucide-react';
import { checkCriteria } from '../services/diagnosisService';

const printStyles = `
  @media print {
    .print-hide {
      display: none !important;
    }
    body {
      font-size: 12px;
      background: white !important;
      color: black !important;
    }
    h1 { font-size: 24px !important; }
    h2 { font-size: 18px !important; }
    h3 { font-size: 16px !important; }
    .max-w-5xl { max-width: none !important; }
    .flex { display: block !important; }
  }
`;

const PrintStyles = () => <style dangerouslySetInnerHTML={{ __html: printStyles }} />;

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const diagnosis = checkCriteria(patient);

  // Print handler using new window for custom HTML
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Sandhigata Vata Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: black; }
              h1 { font-size: 24pt; }
              h2 { font-size: 18pt; margin-top: 20px; border-bottom: 1px solid black; }
              .data-row { margin-bottom: 10px; }
              .positive { color: green; font-weight: bold; }
              .negative { color: red; font-weight: bold; }
              .joint { display: inline-block; margin: 2px 5px; padding: 2px 6px; border: 1px solid black; }
              img { max-width: 300px; height: auto; border: 1px solid black; margin-top: 10px; }
            </style>
          </head>
          <body>
            <h1>${patient.demographics.name}</h1>
            <div>${patient.demographics.age} Years, ${patient.demographics.gender}</div>
            <div>ID: ${patient.demographics.opdIpdNo || 'N/A'}</div>
            <div>Date: ${new Date(patient.createdAt).toLocaleDateString()}</div>

            <h2>Diagnosis Result</h2>
            <div class="data-row ${diagnosis.isPositive ? 'positive' : 'negative'}">
              ${diagnosis.isPositive ? 'POSITIVE for Sandhigata Vata' : 'NEGATIVE for Sandhigata Vata'}
            </div>
            ${!diagnosis.isPositive && diagnosis.reasons.length > 0 ? `
              <div class="data-row">Unmet Criteria: ${diagnosis.reasons.join(', ')}</div>
            ` : ''}

            <h2>Questionnaire Responses</h2>
            <div class="data-row">Joint Pain: ${patient.symptoms.hasJointPain}</div>
            <div class="data-row">Pain Duration: ${patient.symptoms.painDuration}</div>
            <div class="data-row">Pain Onset: ${patient.symptoms.painOnset}</div>
            <div class="data-row">Pain Intensity: ${patient.symptoms.painIntensity}/10</div>
            <div class="data-row">Pain Types: ${patient.symptoms.painTypes.join(', ')}</div>
            <div class="data-row">Swelling: ${patient.symptoms.swelling}</div>
            <div class="data-row">Stiffness: ${patient.symptoms.stiffness}</div>
            <div class="data-row">Crepitus: ${patient.symptoms.crepitus}</div>
            <div class="data-row">Shifting Pain: ${patient.symptoms.shiftingPain}</div>
            <div class="data-row">Warmth: ${patient.symptoms.warmth}</div>
            <div class="data-row">Fever: ${patient.symptoms.fever}</div>
            <div class="data-row">Discoloration: ${patient.symptoms.discoloration}</div>
            <div class="data-row">Oil/Massage Effect: ${patient.symptoms.oilMassageEffect}</div>

            <h2>Affected Joints</h2>
            <div>
              ${patient.affectedJoints.map(j => `<span class="joint">${j}</span>`).join('')}
            </div>

            ${Object.entries(patient.labs).filter(([k]) => k !== 'xrayImage' && k !== 'xrayReport').map(([key, val]) => `
              <h2>${key.replace(/([A-Z])/g, ' $1').trim()}</h2>
              <div>${val || 'N/A'}</div>
            `).join('')}

            ${patient.labs.xrayImage ? `<h2>X-Ray Image</h2><img src="${patient.labs.xrayImage}" />` : ''}

            <h2>Patient Details</h2>
            <div>Address: ${patient.demographics.address || 'N/A'}</div>
            <div>Occupation: ${patient.demographics.occupation || 'N/A'}</div>
            <div>Contact: ${patient.demographics.contact || 'N/A'}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const DetailRow = ({ label, value, isValid }: { label: string, value?: string, isValid?: boolean }) => (
    <div className={`p-3 rounded-lg border ${isValid === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
      <span className="block text-xs text-gray-500 uppercase font-bold mb-1">{label}</span>
      <span className={`text-md font-medium ${isValid === false ? 'text-red-700' : 'text-gray-800'}`}>
        {value || 'N/A'} {isValid === false && "(Invalid)"}
      </span>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      <PrintStyles />
      <button onClick={onBack} className="mb-6 flex items-center text-gray-500 hover:text-ayur-600 transition-colors font-medium print-hide">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to List
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        {/* Header */}
        <div className="bg-ayur-600 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center print:p-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{patient.demographics.name}</h1>
            <div className="flex flex-wrap gap-4 text-ayur-100 text-sm">
              <span className="flex items-center"><User className="w-4 h-4 mr-1"/> {patient.demographics.age} Years, {patient.demographics.gender}</span>
              <span className="opacity-75">ID: {patient.demographics.opdIpdNo || 'N/A'}</span>
              <span className="opacity-75">Date: {new Date(patient.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button onClick={handlePrint} className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center text-sm font-semibold transition-colors">
            <PrinterIcon className="w-4 h-4 mr-2" /> Print Record
          </button>
        </div>

        {/* Diagnosis Banner */}
        <div className={`p-6 border-b print:p-4 ${diagnosis.isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
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
                {diagnosis.isPositive ? "All strict diagnostic criteria for Sandhigata Vata are met." : "The patient does not meet all criteria. Failed criteria are highlighted in red below."}
              </p>
              {!diagnosis.isPositive && diagnosis.reasons.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-red-800 uppercase mb-1">Unmet Criteria Summary:</p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {diagnosis.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-1">
          <div className="lg:col-span-2 p-6 md:p-8 space-y-8 print:p-4">
            {/* Questionnaire */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Questionnaire Responses</h2>
              <DetailRow label="Joint Pain" value={patient.symptoms.hasJointPain} isValid={diagnosis.criteria.jointPain} />
              <DetailRow label="Pain Duration" value={patient.symptoms.painDuration} />
              <DetailRow label="Pain Onset" value={patient.symptoms.painOnset} isValid={diagnosis.criteria.onset} />
              <DetailRow label="Pain Intensity" value={patient.symptoms.painIntensity?.toString()} />
              <DetailRow label="Pain Types" value={patient.symptoms.painTypes.join(', ')} isValid={diagnosis.criteria.painType} />
              <DetailRow label="Swelling" value={patient.symptoms.swelling} isValid={diagnosis.criteria.swelling} />
              <DetailRow label="Stiffness" value={patient.symptoms.stiffness} isValid={diagnosis.criteria.stiffness} />
              <DetailRow label="Crepitus" value={patient.symptoms.crepitus} isValid={diagnosis.criteria.crepitus} />
              <DetailRow label="Shifting Pain" value={patient.symptoms.shiftingPain} isValid={diagnosis.criteria.shiftingPain} />
              <DetailRow label="Warmth" value={patient.symptoms.warmth} isValid={diagnosis.criteria.warmth} />
              <DetailRow label="Fever" value={patient.symptoms.fever} isValid={diagnosis.criteria.fever} />
              <DetailRow label="Discoloration" value={patient.symptoms.discoloration} isValid={diagnosis.criteria.discoloration} />
              <DetailRow label="Oil/Massage Effect" value={patient.symptoms.oilMassageEffect} isValid={diagnosis.criteria.oilEffect} />
            </section>

            {/* Labs */}
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Laboratory & Imaging</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(patient.labs).filter(([k]) => k !== 'xrayImage' && k !== 'xrayReport').map(([key, val]) => (
                  val && (
                    <div key={key} className="p-3 border rounded">
                      <span className="block text-xs text-gray-500 uppercase font-bold mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-mono text-gray-800">{val}</span>
                    </div>
                  )
                ))}
              </div>
              {patient.labs.xrayImage && (
                <div className="mt-4 print:mt-2">
                  <p className="text-sm font-semibold text-gray-600 mb-2 print:mb-1">X-Ray Image</p>
                  <img src={patient.labs.xrayImage} alt="Xray" className="max-h-64 rounded-lg border shadow-sm print:max-h-none print:w-full print:border print:shadow-none" />
                  {patient.labs.xrayReport && <p className="text-xs text-gray-500 mt-2 print:mt-1">File: {patient.labs.xrayReport}</p>}
                </div>
              )}
            </section>

            {/* Body Map */}
            <section>
              <h3 className={`font-bold text-center mb-4 ${diagnosis.criteria.affectedJoints ? 'text-gray-700' : 'text-red-600'}`}>
                Affected Joints (Q11)
                {!diagnosis.criteria.affectedJoints && <span className="block text-xs font-normal mt-1">(Must include Knee, Spine, or Hip)</span>}
              </h3>
              <div className={`bg-white rounded-xl shadow-sm p-2 print:p-1 ${diagnosis.criteria.affectedJoints ? '' : 'border-2 border-red-300'}`}>
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

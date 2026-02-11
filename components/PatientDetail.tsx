import React from 'react';
import { Patient } from '../types';
import BodyMap from './BodyMap';
import VasScale from './VasScale';
import { ArrowLeft, User, Printer as PrinterIcon, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { checkCriteria } from '../services/diagnosisService';

const printStyles = `
  @media print {
    .print-hide {
      display: none !important;
    }
    body {
      font-size: 12px;
    }
    h1 {
      font-size: 24px !important;
    }
    h2 {
      font-size: 18px !important;
    }
    h3 {
      font-size: 16px !important;
    }
    .max-w-5xl {
      max-width: none !important;
    }
  }
`;

const PrintStyles = () => <style dangerouslySetInnerHTML={{ __html: printStyles }} />;

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  // Run diagnosis algorithm to get detailed criteria checks
  const diagnosis = checkCriteria(patient);

  const generatePrintContent = () => {
    // Generate HTML content directly from patient data
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Sandhigata Vata Report</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.4;
                    color: black;
                    background: white;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    background: #2d6e2d; 
                    color: white; 
                    padding: 15px;
                }
                .header h1 { 
                    font-size: 18pt; 
                    margin-bottom: 5pt; 
                }
                .section { 
                    margin-bottom: 20pt; 
                    page-break-inside: avoid; 
                }
                .section h2 { 
                    font-size: 14pt; 
                    font-weight: bold; 
                    margin-bottom: 10pt; 
                    border-bottom: 1pt solid black; 
                    padding-bottom: 5pt; 
                    color: black;
                }
                .data-row { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 8pt; 
                    border-bottom: 1pt solid black; 
                }
                .label { 
                    font-weight: bold; 
                    color: black; 
                }
                .value { 
                    color: black; 
                }
                .positive { 
                    color: black; 
                    font-weight: bold; 
                }
                .negative { 
                    color: black; 
                    font-weight: bold; 
                }
                .joints { 
                    display: flex; 
                    flex-wrap: wrap; 
                    gap: 4px; 
                    margin: 10pt 0; 
                }
                .joint { 
                    background: #f0f0f0; 
                    border: 1pt solid black; 
                    padding: 2px 4px; 
                    font-size: 10px; 
                }
                .lab-item { 
                    border: 1pt solid black; 
                    padding: 8pt; 
                    margin: 5pt 0; 
                    text-align: center; 
                }
                img { 
                    max-width: 300pt; 
                    height: auto; 
                    border: 1pt solid black; 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${patient.demographics.name}</h1>
                <div>${patient.demographics.age} Years, ${patient.demographics.gender}</div>
                <div>ID: ${patient.demographics.opdIpdNo || 'N/A'}</div>
                <div>Date: ${new Date(patient.createdAt).toLocaleDateString()}</div>
            </div>
            
            <div class="section">
                <h2>Diagnosis Result</h2>
                <div class="data-row">
                    <span class="label">Result:</span>
                    <span class="${diagnosis.isPositive ? 'positive' : 'negative'}">
                        ${diagnosis.isPositive ? 'POSITIVE for Sandhigata Vata' : 'NEGATIVE for Sandhigata Vata'}
                    </span>
                </div>
                <div class="data-row">
                    <span class="label">Details:</span>
                    <span class="value">
                        ${diagnosis.isPositive 
                            ? 'All strict diagnostic criteria for Sandhigata Vata are met.' 
                            : 'The patient does not meet all criteria. Failed criteria are highlighted in red below.'}
                    </span>
                </div>
                ${!diagnosis.isPositive && diagnosis.reasons.length > 0 ? `
                <div class="data-row">
                    <span class="label">Unmet Criteria:</span>
                    <span class="value">
                        ${diagnosis.reasons.join(', ')}
                    </span>
                </div>
                ` : ''}
            </div>
            
            <div class="section">
                <h2>Questionnaire Responses</h2>
                <div class="data-row">
                    <span class="label">1. Joint Pain:</span>
                    <span class="${!diagnosis.criteria.jointPain ? 'negative' : ''}">${patient.symptoms.hasJointPain}</span>
                </div>
                <div class="data-row">
                    <span class="label">Pain Duration:</span>
                    <span class="value">${patient.symptoms.painDuration}</span>
                </div>
                <div class="data-row">
                    <span class="label">Pain Onset:</span>
                    <span class="${!diagnosis.criteria.onset ? 'negative' : ''}">${patient.symptoms.painOnset}</span>
                </div>
                <div class="data-row">
                    <span class="label">Pain Intensity:</span>
                    <span class="value">${patient.symptoms.painIntensity}/10</span>
                </div>
                <div class="data-row">
                    <span class="label">Pain Types:</span>
                    <span class="value">${patient.symptoms.painTypes.join(', ')}</span>
                </div>
                <div class="data-row">
                    <span class="label">Swelling:</span>
                    <span class="${!diagnosis.criteria.swelling ? 'negative' : ''}">${patient.symptoms.swelling} ${patient.symptoms.swelling !== 'Never' ? `(Since: ${patient.symptoms.swellingDuration})` : ''}</span>
                </div>
                <div class="data-row">
                    <span class="label">Stiffness:</span>
                    <span class="${!diagnosis.criteria.stiffness ? 'negative' : ''}">${patient.symptoms.stiffness} ${patient.symptoms.stiffness === 'Yes' ? `(${patient.symptoms.stiffnessDuration})` : ''}</span>
                </div>
                <div class="data-row">
                    <span class="label">Crepitus:</span>
                    <span class="${!diagnosis.criteria.crepitus ? 'negative' : ''}">${patient.symptoms.crepitus}</span>
                </div>
                <div class="data-row">
                    <span class="label">Shifting Pain:</span>
                    <span class="${!diagnosis.criteria.shiftingPain ? 'negative' : ''}">${patient.symptoms.shiftingPain}</span>
                </div>
                <div class="data-row">
                    <span class="label">Warmth:</span>
                    <span class="${!diagnosis.criteria.warmth ? 'negative' : ''}">${patient.symptoms.warmth}</span>
                </div>
                <div class="data-row">
                    <span class="label">Fever:</span>
                    <span class="${!diagnosis.criteria.fever ? 'negative' : ''}">${patient.symptoms.fever}</span>
                </div>
                <div class="data-row">
                    <span class="label">Discoloration:</span>
                    <span class="${!diagnosis.criteria.discoloration ? 'negative' : ''}">${patient.symptoms.discoloration}</span>
                </div>
                <div class="data-row">
                    <span class="label">Oil/Massage Effect:</span>
                    <span class="${!diagnosis.criteria.oilEffect ? 'negative' : ''}">${patient.symptoms.oilMassageEffect}</span>
                </div>
            </div>
            
            <div class="section">
                <h2>Affected Joints</h2>
                <div class="joints">
                    ${patient.affectedJoints.map(joint => `<span class="joint">${joint}</span>`).join('')}
                </div>
            </div>
            
            ${Object.entries(patient.labs).filter(([key]) => key !== 'xrayImage' && key !== 'xrayReport').length > 0 ? `
                <div class="section">
                    <h2>Laboratory Results</h2>
                    ${Object.entries(patient.labs).filter(([key]) => key !== 'xrayImage' && key !== 'xrayReport').map(([key, value]) => `
                        <div class="lab-item">
                            <div class="label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                            <div class="value">${value || 'N/A'}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${patient.labs.xrayImage ? `
                <div class="section">
                    <h2>X-Ray Image</h2>
                    <div style="text-align: center;">
                        <img src="${patient.labs.xrayImage}" alt="X-ray" />
                        ${patient.labs.xrayReport ? `<div style="margin-top: 10px; font-size: 10px;">File: ${patient.labs.xrayReport}</div>` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div class="section">
                <h2>Patient Details</h2>
                <div class="data-row">
                    <span class="label">Address:</span>
                    <span class="value">${patient.demographics.address || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span class="label">Occupation:</span>
                    <span class="value">${patient.demographics.occupation || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span class="label">Contact:</span>
                    <span class="value">${patient.demographics.contact || 'N/A'}</span>
                </div>
                <div class="data-row">
                    <span class="label">OPD/IPD No:</span>
                    <span class="value">${patient.demographics.opdIpdNo || 'N/A'}</span>
                </div>
            </div>
        </body>
        </html>
    `;
  };

  const handlePrint = () => {
    try {
      // Check if running in WebView
      const isWebView = /(wv|WebView)/.test(navigator.userAgent) || 
                        window.hasOwnProperty('_cordovaNative') || 
                        window.hasOwnProperty('webkit') ||
                        (window as any).cordova;
      
      if (isWebView) {
        // Use Cordova printer plugin for WebView with clean options
        (window as any).cordova.plugins.printer.print({
          documents: [{
            content: generateCleanPrintContent(),
            name: `Sandhigata-Vata-Report-${patient.demographics.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
            type: 'pdf'
          }],
          options: {
            duplex: 'none',
            copies: 1,
            color: true,
            border: true,
            orientation: 'portrait'
          }
        }, (success: any) => {
          if (success) {
            alert('✅ Report sent to printer successfully!');
          } else {
            alert('❌ Print failed. Please check printer connection.');
          }
        }, (error: any) => {
          console.error('WebView print error:', error);
          alert('❌ Print error: ' + (error || 'Unknown error'));
        });
      } else {
        // Regular browser print with clean content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(generateCleanPrintContent());
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        } else {
          alert('Please allow popups for printing');
        }
      }
    } catch (error) {
      console.error('Print failed:', error);
      alert('❌ Print not available. Please try again.');
    }
  };

  const generateCleanPrintContent = () => {
    // Generate clean, mobile-optimized HTML content
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sandhigata Vata Diagnosis Report</title>
            <style>
                * { 
                    margin: 0; 
                    padding: 0; 
                    box-sizing: border-box; 
                }
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    margin: 0; 
                    padding: 15px; 
                    line-height: 1.5; 
                    color: #000; 
                    background: #fff; 
                    font-size: 12px;
                }
                .report-header { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    background: linear-gradient(135deg, #2d6e2d, #4a8c4a); 
                    color: white; 
                    padding: 20px; 
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .report-header h1 { 
                    font-size: 20px; 
                    margin-bottom: 8px; 
                    font-weight: 600;
                }
                .report-header .subtitle {
                    font-size: 14px;
                    opacity: 0.9;
                }
                .patient-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 20px;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    border-left: 4px solid #2d6e2d;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-bottom: 1px solid #e9ecef;
                }
                .info-label {
                    font-weight: 600;
                    color: #495057;
                }
                .info-value {
                    color: #212529;
                }
                .section { 
                    margin-bottom: 25px; 
                    page-break-inside: avoid; 
                    background: white;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .section-header { 
                    background: #2d6e2d; 
                    color: white; 
                    padding: 12px 15px; 
                    font-size: 14px; 
                    font-weight: 600;
                    border-bottom: 2px solid #1e4a1e;
                }
                .section-content {
                    padding: 15px;
                }
                .diagnosis-result {
                    text-align: center;
                    padding: 20px;
                    border-radius: 6px;
                    margin: 15px 0;
                    font-weight: 600;
                    font-size: 16px;
                }
                .positive {
                    background: #d4edda;
                    color: #155724;
                    border: 2px solid #c3e6cb;
                }
                .negative {
                    background: #f8d7da;
                    color: #721c24;
                    border: 2px solid #f5c6cb;
                }
                .criteria-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 15px;
                }
                .criteria-item {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border-radius: 4px;
                    border-left: 3px solid #28a745;
                    background: #f8f9fa;
                }
                .criteria-item.failed {
                    border-left-color: #dc3545;
                    background: #fff5f5;
                }
                .criteria-icon {
                    margin-right: 8px;
                    font-size: 16px;
                }
                .criteria-text {
                    flex: 1;
                    font-size: 11px;
                }
                .joints-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-top: 10px;
                }
                .joint-tag {
                    background: #e9ecef;
                    border: 1px solid #ced4da;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 500;
                }
                .lab-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin-top: 10px;
                }
                .lab-item {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    padding: 12px;
                    border-radius: 4px;
                    text-align: center;
                }
                .lab-label {
                    font-weight: 600;
                    color: #495057;
                    font-size: 11px;
                    margin-bottom: 4px;
                }
                .lab-value {
                    color: #212529;
                    font-size: 12px;
                }
                .xray-container {
                    text-align: center;
                    margin: 15px 0;
                }
                .xray-image {
                    max-width: 100%;
                    max-height: 300px;
                    border: 2px solid #e9ecef;
                    border-radius: 4px;
                }
                .xray-filename {
                    margin-top: 8px;
                    font-size: 10px;
                    color: #6c757d;
                    font-style: italic;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #e9ecef;
                    color: #6c757d;
                    font-size: 10px;
                }
                @media print {
                    body { margin: 0; padding: 10px; }
                    .section { page-break-inside: avoid; }
                    .report-header { page-break-after: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>🏥 Sandhigata Vata Diagnosis Report</h1>
                <div class="subtitle">Ayurvedic Joint Disorder Assessment</div>
            </div>
            
            <div class="patient-info">
                <div class="info-item">
                    <span class="info-label">Patient Name:</span>
                    <span class="info-value">${patient.demographics.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Age & Gender:</span>
                    <span class="info-value">${patient.demographics.age} Years, ${patient.demographics.gender}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">OPD/IPD No:</span>
                    <span class="info-value">${patient.demographics.opdIpdNo || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Report Date:</span>
                    <span class="info-value">${new Date(patient.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">🔍 Diagnosis Result</div>
                <div class="section-content">
                    <div class="diagnosis-result ${diagnosis.isPositive ? 'positive' : 'negative'}">
                        ${diagnosis.isPositive ? '✅ POSITIVE for Sandhigata Vata' : '❌ NEGATIVE for Sandhigata Vata'}
                    </div>
                    <div class="criteria-grid">
                        <div class="criteria-item ${!diagnosis.criteria.jointPain ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.jointPain ? '✓' : '✗'}</span>
                            <span class="criteria-text">Joint Pain Present</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.onset ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.onset ? '✓' : '✗'}</span>
                            <span class="criteria-text">Gradual Onset</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.swelling ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.swelling ? '✓' : '✗'}</span>
                            <span class="criteria-text">Joint Swelling</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.stiffness ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.stiffness ? '✓' : '✗'}</span>
                            <span class="criteria-text">Morning Stiffness</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.crepitus ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.crepitus ? '✓' : '✗'}</span>
                            <span class="criteria-text">Crepitus Sound</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.shiftingPain ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.shiftingPain ? '✓' : '✗'}</span>
                            <span class="criteria-text">Shifting Pain</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.warmth ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.warmth ? '✓' : '✗'}</span>
                            <span class="criteria-text">Joint Warmth</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.fever ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.fever ? '✓' : '✗'}</span>
                            <span class="criteria-text">No Fever</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.discoloration ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.discoloration ? '✓' : '✗'}</span>
                            <span class="criteria-text">No Discoloration</span>
                        </div>
                        <div class="criteria-item ${!diagnosis.criteria.oilEffect ? 'failed' : ''}">
                            <span class="criteria-icon">${diagnosis.criteria.oilEffect ? '✓' : '✗'}</span>
                            <span class="criteria-text">Oil Massage Relief</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">📋 Clinical Assessment</div>
                <div class="section-content">
                    <div class="criteria-grid">
                        <div class="criteria-item">
                            <span class="criteria-icon">📊</span>
                            <span class="criteria-text">Pain Intensity: ${patient.symptoms.painIntensity}/10</span>
                        </div>
                        <div class="criteria-item">
                            <span class="criteria-icon">⏱️</span>
                            <span class="criteria-text">Duration: ${patient.symptoms.painDuration}</span>
                        </div>
                        <div class="criteria-item">
                            <span class="criteria-icon">🎯</span>
                            <span class="criteria-text">Pain Types: ${patient.symptoms.painTypes.join(', ')}</span>
                        </div>
                        <div class="criteria-item">
                            <span class="criteria-icon">🌅</span>
                            <span class="criteria-text">Stiffness: ${patient.symptoms.stiffness} ${patient.symptoms.stiffness === 'Yes' ? `(${patient.symptoms.stiffnessDuration})` : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <div class="section-header">🦴 Affected Joints</div>
                <div class="section-content">
                    <div class="joints-container">
                        ${patient.affectedJoints.map(joint => `<span class="joint-tag">${joint}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            ${Object.entries(patient.labs).filter(([key]) => key !== 'xrayImage' && key !== 'xrayReport').length > 0 ? `
                <div class="section">
                    <div class="section-header">🧪 Laboratory Results</div>
                    <div class="section-content">
                        <div class="lab-grid">
                            ${Object.entries(patient.labs).filter(([key]) => key !== 'xrayImage' && key !== 'xrayReport').map(([key, value]) => `
                                <div class="lab-item">
                                    <div class="lab-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                    <div class="lab-value">${value || 'N/A'}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${patient.labs.xrayImage ? `
                <div class="section">
                    <div class="section-header">📷 X-Ray Report</div>
                    <div class="section-content">
                        <div class="xray-container">
                            <img src="${patient.labs.xrayImage}" alt="X-ray" class="xray-image" />
                            ${patient.labs.xrayReport ? `<div class="xray-filename">File: ${patient.labs.xrayReport}</div>` : ''}
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="section">
                <div class="section-header">👤 Patient Details</div>
                <div class="section-content">
                    <div class="criteria-grid">
                        <div class="criteria-item">
                            <span class="criteria-icon">📍</span>
                            <span class="criteria-text">Address: ${patient.demographics.address || 'N/A'}</span>
                        </div>
                        <div class="criteria-item">
                            <span class="criteria-icon">💼</span>
                            <span class="criteria-text">Occupation: ${patient.demographics.occupation || 'N/A'}</span>
                        </div>
                        <div class="criteria-item">
                            <span class="criteria-icon">📞</span>
                            <span class="criteria-text">Contact: ${patient.demographics.contact || 'N/A'}</span>
                        </div>
                        <div class="criteria-item">
                            <span class="criteria-icon">🆔</span>
                            <span class="criteria-text">ID: ${patient.demographics.opdIpdNo || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div>📅 Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div>🏥 Sandhigata Vata Diagnosis System</div>
            </div>
        </body>
        </html>
    `;
  };

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

        {/* Diagnostic Result Banner */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 print:grid-cols-1">
            {/* Left Column: Clinical Info */}
            <div className="lg:col-span-2 p-6 md:p-8 space-y-8 print:p-4">
                
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

                    <div className="grid grid-cols-1 gap-4 print:gap-2">
                        <DetailRow
                            label="2. Type of Pain"
                            value={patient.symptoms.painTypes.join(', ')}
                            isValid={diagnosis.criteria.painType}
                        />

                        <div className="grid grid-cols-2 gap-4 print:grid-cols-1 print:gap-2">
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

                        <div className="grid grid-cols-2 gap-4 print:grid-cols-1 print:gap-2">
                             <DetailRow label="5. Crepitus" value={patient.symptoms.crepitus} isValid={diagnosis.criteria.crepitus} />
                             <DetailRow label="6. Shifting Pain" value={patient.symptoms.shiftingPain} isValid={diagnosis.criteria.shiftingPain} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 print:grid-cols-1 print:gap-2">
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
                        <div className="mt-4 print:mt-2">
                            <p className="text-sm font-semibold text-gray-600 mb-2 print:mb-1">X-Ray Image</p>
                            <img src={patient.labs.xrayImage} alt="Xray" className="max-h-64 rounded-lg border shadow-sm print:max-h-none print:w-full print:border print:shadow-none" />
                            {patient.labs.xrayReport && <p className="text-xs text-gray-500 mt-2 print:mt-1">File: {patient.labs.xrayReport}</p>}
                        </div>
                    )}
                </section>

                {/* Body Map Section */}
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

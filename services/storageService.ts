import { Patient } from '../types';

const STORAGE_KEY = 'sandhigata_vata_patients';
const STORAGE_STATS_KEY = 'sandhigata_vata_storage_stats';

// Estimate size of a single patient record in bytes
const ESTIMATED_PATIENT_SIZE = 5000; // ~5KB per patient including images

// Storage management utilities
export const getStorageStats = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  const patients = data ? JSON.parse(data) : [];
  const dataSize = new Blob([data || '']).size;
  const availableSpace = 5 * 1024 * 1024; // ~5MB typical localStorage limit
  
  return {
    patientCount: patients.length,
    dataSizeKB: Math.round(dataSize / 1024),
    availableSpaceKB: Math.round(availableSpace / 1024),
    usagePercentage: Math.round((dataSize / availableSpace) * 100),
    estimatedCapacity: Math.floor(availableSpace / ESTIMATED_PATIENT_SIZE)
  };
};

export const checkStorageCapacity = () => {
  const stats = getStorageStats();
  return {
    canAddMore: stats.usagePercentage < 80,
    remainingSpace: stats.availableSpaceKB - stats.dataSizeKB,
    maxAdditionalPatients: Math.floor((stats.availableSpaceKB - stats.dataSizeKB) / 5),
    warning: stats.usagePercentage > 70 ? 'Storage getting full' : null
  };
};

// Optimized save with compression for large datasets
export const savePatient = (patient: Patient): void => {
  const capacity = checkStorageCapacity();
  
  if (!capacity.canAddMore) {
    throw new Error(`Storage almost full. Can only add ${capacity.maxAdditionalPatients} more patients. Consider exporting and deleting old records.`);
  }
  
  const existing = getPatients();
  const updated = [patient, ...existing.filter(p => p.id !== patient.id)];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    updateStorageStats();
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some patient records to continue.');
    }
    throw error;
  }
};

export const getPatients = (): Patient[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading patient data:', error);
    return [];
  }
};

// Paginated patient retrieval for better performance
export const getPatientsPaginated = (page: number = 1, pageSize: number = 20) => {
  const allPatients = getPatients();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    patients: allPatients.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(allPatients.length / pageSize),
    totalPatients: allPatients.length,
    hasNextPage: endIndex < allPatients.length,
    hasPreviousPage: page > 1
  };
};

// Search patients by name or ID
export const searchPatients = (query: string): Patient[] => {
  const allPatients = getPatients();
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) return allPatients;
  
  return allPatients.filter(patient => 
    patient.demographics.name.toLowerCase().includes(searchTerm) ||
    patient.id.toLowerCase().includes(searchTerm) ||
    patient.demographics.opdIpdNo?.toLowerCase().includes(searchTerm) ||
    patient.demographics.contact?.toLowerCase().includes(searchTerm)
  );
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = getPatients();
  return patients.find(p => p.id === id);
};

export const deletePatient = (id: string): void => {
  const existing = getPatients();
  const updated = existing.filter(p => p.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    updateStorageStats();
  } catch (error) {
    console.error('Error deleting patient:', error);
  }
};

// Delete multiple patients by ids (safe helper)
export const deletePatients = (ids: string[]): void => {
  if (!ids || ids.length === 0) return;
  const existing = getPatients();
  const idSet = new Set(ids);
  const updated = existing.filter(p => !idSet.has(p.id));
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    updateStorageStats();
  } catch (error) {
    console.error('Error deleting patients:', error);
  }
};

// Update storage statistics
const updateStorageStats = (): void => {
  const stats = getStorageStats();
  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
};

// Export patient data for backup
export const exportPatientData = (): string => {
  const patients = getPatients();
  const exportData = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    patientCount: patients.length,
    patients: patients
  };
  
  return JSON.stringify(exportData, null, 2);
};

// Import patient data from backup
export const importPatientData = (jsonData: string): { success: boolean; imported: number; errors: string[] } => {
  const errors: string[] = [];
  let imported = 0;
  
  try {
    const importData = JSON.parse(jsonData);
    
    if (!importData.patients || !Array.isArray(importData.patients)) {
      errors.push('Invalid data format');
      return { success: false, imported: 0, errors };
    }
    
    const stats = getStorageStats();
    const totalAfterImport = getPatients().length + importData.patients.length;
    
    if (totalAfterImport > stats.estimatedCapacity) {
      errors.push(`Import would exceed storage capacity. Max capacity: ${stats.estimatedCapacity} patients`);
      return { success: false, imported: 0, errors };
    }
    
    // Merge with existing data, avoiding duplicates
    const existingPatients = getPatients();
    const existingIds = new Set(existingPatients.map(p => p.id));
    const newPatients = importData.patients.filter((p: Patient) => !existingIds.has(p.id));
    
    const mergedPatients = [...newPatients, ...existingPatients];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedPatients));
    updateStorageStats();
    
    imported = newPatients.length;
    
  } catch (error) {
    errors.push(`Import failed: ${error.message}`);
  }
  
  return {
    success: errors.length === 0,
    imported,
    errors
  };
};

// Clear all patient data (with confirmation)
export const clearAllPatientData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STATS_KEY);
  } catch (error) {
    console.error('Error clearing patient data:', error);
  }
};

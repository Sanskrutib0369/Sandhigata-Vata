import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { getStorageStats, checkStorageCapacity } from '../services/storageService';

interface StorageStatusProps {
  refreshTrigger?: number;
}

const StorageStatus: React.FC<StorageStatusProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState(getStorageStats());
  const [capacity, setCapacity] = useState(checkStorageCapacity());

  // Update stats when refreshTrigger changes
  useEffect(() => {
    refreshStats();
  }, [refreshTrigger]);

  // Manual refresh function
  const refreshStats = () => {
    setStats(getStorageStats());
    setCapacity(checkStorageCapacity());
  };

  const getStorageColor = () => {
    if (stats.usagePercentage > 80) return 'text-red-600';
    if (stats.usagePercentage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStorageBgColor = () => {
    if (stats.usagePercentage > 80) return 'bg-red-100';
    if (stats.usagePercentage > 60) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Database className="w-5 h-5 mr-2 text-blue-600" />
          Storage Status
        </h3>
      </div>

      {/* Storage Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.patientCount}</div>
          <div className="text-xs text-gray-500">Patients</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.dataSizeKB}</div>
          <div className="text-xs text-gray-500">KB Used</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getStorageColor()}`}>{stats.usagePercentage}%</div>
          <div className="text-xs text-gray-500">Usage</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.estimatedCapacity}</div>
          <div className="text-xs text-gray-500">Est. Capacity</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Storage Usage</span>
          <span>{stats.dataSizeKB} KB / {stats.availableSpaceKB} KB</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStorageBgColor()}`}
            style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Warnings */}
      {capacity.warning && (
        <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
          <span className="text-sm text-yellow-800">{capacity.warning}</span>
        </div>
      )}

      {!capacity.canAddMore && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
          <span className="text-sm text-red-800">
            Storage almost full! Only {capacity.maxAdditionalPatients} more patients can be added.
          </span>
        </div>
      )}

      {/* Storage Info */}
      <div className="text-xs text-gray-500 mt-4">
        <p>• Estimated capacity: ~{stats.estimatedCapacity} patients</p>
        <p>• Average size: ~5KB per patient (including images)</p>
        <p>• Local storage limit: ~5MB (varies by browser)</p>
        <p>• Data is stored locally in your browser</p>
      </div>
    </div>
  );
};

export default StorageStatus;

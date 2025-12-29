// components/GPSStatusIndicator.jsx
import React, { useState, useEffect } from 'react';

const GPSStatusIndicator = ({ isTracking, accuracy, batteryLevel }) => {
  const [permissionState, setPermissionState] = useState('prompt');

  useEffect(() => {
    // Check geolocation permission
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((permission) => {
          setPermissionState(permission.state);
          permission.onchange = () => setPermissionState(permission.state);
        });
    }
  }, []);

  const getStatusColor = () => {
    if (!isTracking) return 'gray';
    if (permissionState === 'denied') return 'red';
    if (accuracy > 100) return 'yellow';
    if (accuracy > 50) return 'orange';
    return 'green';
  };

  const getStatusText = () => {
    if (!isTracking) return 'Not Tracking';
    if (permissionState === 'denied') return 'Permission Denied';
    if (accuracy > 100) return 'Poor Accuracy';
    if (accuracy > 50) return 'Moderate Accuracy';
    return 'Good Accuracy';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div
          className={`w-3 h-3 rounded-full animate-pulse ${
            getStatusColor() === 'green' ? 'bg-green-500' :
            getStatusColor() === 'yellow' ? 'bg-yellow-500' :
            getStatusColor() === 'orange' ? 'bg-orange-500' :
            getStatusColor() === 'red' ? 'bg-red-500' : 'bg-gray-500'
          }`}
        />
        {isTracking && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              backgroundColor: getStatusColor() === 'green' ? '#10B981' :
                              getStatusColor() === 'yellow' ? '#F59E0B' :
                              getStatusColor() === 'orange' ? '#F97316' :
                              getStatusColor() === 'red' ? '#EF4444' : '#6B7280',
              animationDuration: '2s',
            }}
          />
        )}
      </div>
      
      <div>
        <div className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </div>
        {isTracking && accuracy && (
          <div className="text-xs text-gray-500">
            Accuracy: {accuracy.toFixed(1)}m
          </div>
        )}
      </div>
      
      {batteryLevel !== null && (
        <div className="ml-auto">
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500">Battery</div>
            <div className={`text-sm font-medium ${
              batteryLevel > 50 ? 'text-green-600' :
              batteryLevel > 20 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {batteryLevel}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPSStatusIndicator;
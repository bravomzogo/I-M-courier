// DriverWebGPS.jsx (for web browsers)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DriverWebGPS = ({ driverId }) => {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState('');
  const [trackingInterval, setTrackingInterval] = useState(30); // seconds
  const [watchId, setWatchId] = useState(null);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const sendLocationToServer = async (position) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        bearing: position.coords.heading,
        altitude: position.coords.altitude,
        timestamp: new Date(position.timestamp).toISOString(),
      };

      await axios.post(`${API_BASE}/driver/gps/tracking/`, locationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Location sent:', new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to send location:', err);
    }
  };

  const startTracking = async () => {
    try {
      // Get initial location
      const position = await getCurrentLocation();
      setLocation(position.coords);
      await sendLocationToServer(position);
      
      // Start watching position
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLocation(position.coords);
          sendLocationToServer(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(`Location error: ${error.message}`);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 15000,
        }
      );
      
      setWatchId(id);
      setIsTracking(true);
      
      // Update driver status
      await axios.post(`${API_BASE}/driver/gps/status/`, {
        is_online: true,
        tracking_interval: trackingInterval,
      });
      
    } catch (err) {
      setError(`Failed to start tracking: ${err.message}`);
    }
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    
    // Update driver status
    axios.post(`${API_BASE}/driver/gps/status/`, {
      is_online: false,
    }).catch(console.error);
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Driver GPS Tracking</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {location ? (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Latitude:</span>
            <span>{location.latitude.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Longitude:</span>
            <span>{location.longitude.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Accuracy:</span>
            <span>{location.accuracy?.toFixed(1) || 'N/A'} meters</span>
          </div>
          {location.speed !== null && (
            <div className="flex justify-between">
              <span className="font-semibold">Speed:</span>
              <span>{(location.speed * 3.6).toFixed(1)} km/h</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 text-gray-500">No location data</div>
      )}
      
      <div className="space-y-4">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
          >
            Start GPS Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            Stop GPS Tracking
          </button>
        )}
        
        <div className="space-y-2">
          <label className="block font-semibold">Update Interval:</label>
          <div className="flex space-x-2">
            {[10, 30, 60].map((interval) => (
              <button
                key={interval}
                onClick={() => setTrackingInterval(interval)}
                className={`flex-1 py-2 rounded-lg ${
                  trackingInterval === interval
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {interval}s
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="font-semibold text-blue-800">Status:</div>
          <div className={`font-bold ${
            isTracking ? 'text-green-600' : 'text-gray-600'
          }`}>
            {isTracking ? 'ACTIVE TRACKING' : 'NOT TRACKING'}
          </div>
          {isTracking && (
            <div className="mt-2 text-sm text-blue-600">
              • Updates every {trackingInterval} seconds
              <br />
              • Real-time location tracking enabled
              <br />
              • Updates assigned parcels automatically
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverWebGPS;
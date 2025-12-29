// components/DriverGPSTracking.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons - use CDN or local files
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// Custom driver icon
const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Car icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
});

// Parcel pickup icon
const parcelIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3208/3208720.png', // Package icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Component to recenter map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const DriverGPSTracking = () => {
  const { user, token, logout } = useAuth(); // Assuming your AuthContext provides these
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [trackingInterval, setTrackingInterval] = useState(30);
  const [accuracy, setAccuracy] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [routeHistory, setRouteHistory] = useState([]);
  const [assignedParcels, setAssignedParcels] = useState([]);
  const [activeParcel, setActiveParcel] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [trackingStats, setTrackingStats] = useState({
    updatesSent: 0,
    totalDistance: 0,
    startTime: null,
  });
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]); // Default to Nairobi

  const watchId = useRef(null);
  const lastLocation = useRef(null);
  const mapRef = useRef(null);

  // Get assigned parcels
  useEffect(() => {
    if (token) {
      fetchAssignedParcels();
      checkDriverStatus();
    }
  }, [token]);

  const fetchAssignedParcels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/parcels/assigned/', {
        headers: { Authorization: `Token ${token}` },
      });
      setAssignedParcels(response.data);
    } catch (err) {
      console.error('Failed to fetch assigned parcels:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const checkDriverStatus = async () => {
    try {
      const response = await axios.get('/api/driver/status/', {
        headers: { Authorization: `Token ${token}` },
      });
      setIsOnline(response.data.is_online);
      
      // If driver was tracking, auto-start
      if (response.data.is_online && !isTracking) {
        startTracking();
      }
    } catch (err) {
      console.error('Failed to check driver status:', err);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sendLocationToServer = async (position, isManual = false) => {
    if (!token) {
      setError('Authentication required. Please login.');
      return;
    }

    try {
      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed,
        bearing: position.coords.heading,
        altitude: position.coords.altitude,
        timestamp: new Date(position.timestamp).toISOString(),
        battery_level: batteryLevel,
      };

      // If there's an active parcel, include it
      if (activeParcel) {
        locationData.parcel_id = activeParcel.id;
      }

      const response = await axios.post('/api/driver/gps/tracking/', locationData, {
        headers: { 
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update tracking stats
      setTrackingStats(prev => ({
        ...prev,
        updatesSent: prev.updatesSent + 1,
      }));

      // Calculate distance
      if (lastLocation.current) {
        const distance = calculateDistance(
          lastLocation.current.latitude,
          lastLocation.current.longitude,
          position.coords.latitude,
          position.coords.longitude
        );
        
        if (distance > 0.001) { // Ignore small movements (<1m)
          setTrackingStats(prev => ({
            ...prev,
            totalDistance: prev.totalDistance + distance,
          }));
        }
      }

      lastLocation.current = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Add to route history
      setRouteHistory(prev => [
        ...prev.slice(-99), // Keep only last 100 points
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date(position.timestamp),
          accuracy: position.coords.accuracy,
        },
      ]);

      return response.data;
    } catch (err) {
      console.error('Failed to send location:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        logout();
      } else {
        setError(`Failed to send location: ${err.response?.data?.error || err.message}`);
      }
      return null;
    }
  };

  const updateDriverStatus = async (online) => {
    if (!token) return;

    try {
      await axios.post('/api/driver/gps/status/', {
        is_online: online,
        tracking_interval: trackingInterval,
      }, {
        headers: { 
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setIsOnline(online);
    } catch (err) {
      console.error('Failed to update driver status:', err);
    }
  };

  const startTracking = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    // Check permissions
    let permission;
    try {
      if (navigator.permissions && navigator.permissions.query) {
        permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setError('Location permission denied. Please enable it in your browser settings.');
          return;
        }
      }
    } catch (err) {
      // Permission API not supported, continue anyway
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocation(position.coords);
        setAccuracy(position.coords.accuracy);
        setSpeed(position.coords.speed);
        
        // Update map center
        setMapCenter([position.coords.latitude, position.coords.longitude]);
        
        await sendLocationToServer(position, true);
        
        // Start watching position
        watchId.current = navigator.geolocation.watchPosition(
          (newPosition) => {
            setLocation(newPosition.coords);
            setAccuracy(newPosition.coords.accuracy);
            setSpeed(newPosition.coords.speed);
            sendLocationToServer(newPosition);
          },
          (watchError) => {
            console.error('Geolocation watch error:', watchError);
            setError(`Geolocation error: ${watchError.message}`);
            stopTracking();
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 15000,
          }
        );

        setIsTracking(true);
        await updateDriverStatus(true);
        setTrackingStats({
          updatesSent: 1,
          totalDistance: 0,
          startTime: new Date(),
        });

        // Get battery level if supported
        if ('getBattery' in navigator) {
          try {
            const battery = await navigator.getBattery();
            setBatteryLevel(Math.round(battery.level * 100));
            battery.addEventListener('levelchange', () => {
              setBatteryLevel(Math.round(battery.level * 100));
            });
          } catch (err) {
            console.log('Battery API not supported');
          }
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(`Failed to get location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const stopTracking = async () => {
    if (watchId.current) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    
    setIsTracking(false);
    await updateDriverStatus(false);
    
    // Send one last location update
    if (location && token) {
      navigator.geolocation.getCurrentPosition(
        (position) => sendLocationToServer(position, true),
        null,
        { enableHighAccuracy: false }
      );
    }
  };

  const handleParcelSelect = (parcel) => {
    setActiveParcel(parcel);
    // Center map on parcel pickup location
    if (parcel.pickup_location_lat && parcel.pickup_location_lng) {
      setMapCenter([parcel.pickup_location_lat, parcel.pickup_location_lng]);
    }
  };

  const handleCompleteDelivery = async () => {
    if (!activeParcel || !token) return;
    
    try {
      await axios.post(`/api/parcels/${activeParcel.id}/update-status/`, {
        status: 'Delivered',
        location_lat: location?.latitude,
        location_lng: location?.longitude,
      }, {
        headers: { 
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Refresh parcels list
      fetchAssignedParcels();
      setActiveParcel(null);
      setError('Delivery marked as complete!');
      setTimeout(() => setError(''), 3000);
    } catch (err) {
      console.error('Failed to complete delivery:', err);
      setError('Failed to mark delivery as complete');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  // Auto-start tracking if driver was previously online
  useEffect(() => {
    if (isOnline && !isTracking && token) {
      startTracking();
    }
  }, [isOnline, token]);

  // Get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (err) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  // Handle location error
  const showLocationError = (error) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        setError("Location access denied. Please enable location services in your browser settings.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information unavailable.");
        break;
      case error.TIMEOUT:
        setError("Location request timed out. Please try again.");
        break;
      default:
        setError("An unknown error occurred while getting location.");
        break;
    }
  };

  // If no user/token, show login prompt
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please login as a driver to access GPS tracking.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">GPS Location Tracking</h2>
            <p className="text-gray-600">
              {user?.email ? `Logged in as: ${user.email}` : 'Driver Dashboard'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full font-semibold ${
              isTracking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isTracking ? 'TRACKING ACTIVE' : 'NOT TRACKING'}
            </div>
            {batteryLevel && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                batteryLevel > 50 ? 'bg-green-100 text-green-800' :
                batteryLevel > 20 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                🔋 {batteryLevel}%
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={() => setError('')}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls and Info */}
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-4">
                {!isTracking ? (
                  <button
                    onClick={startTracking}
                    disabled={loading}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition duration-200 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Start GPS Tracking
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={stopTracking}
                    className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    Stop GPS Tracking
                  </button>
                )}
              </div>

              {/* Tracking Interval */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Interval
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 30, 60].map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setTrackingInterval(interval)}
                      disabled={isTracking}
                      className={`py-2 rounded-lg transition duration-200 ${
                        trackingInterval === interval
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } ${isTracking ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {interval}s
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Info */}
            {location && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3">Current Location</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono">{location.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono">{location.longitude.toFixed(6)}</span>
                  </div>
                  {accuracy && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="font-mono">{accuracy.toFixed(1)}m</span>
                    </div>
                  )}
                  {speed !== null && speed > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-mono">{(speed * 3.6).toFixed(1)} km/h</span>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <button
                      onClick={() => {
                        if (location) {
                          navigator.clipboard.writeText(`${location.latitude}, ${location.longitude}`);
                          setError('Coordinates copied to clipboard!');
                          setTimeout(() => setError(''), 2000);
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Copy Coordinates
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Stats */}
            {isTracking && trackingStats.startTime && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 mb-3">Tracking Statistics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Updates Sent:</span>
                    <span className="font-bold">{trackingStats.updatesSent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Distance Traveled:</span>
                    <span className="font-bold">{trackingStats.totalDistance.toFixed(2)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Duration:</span>
                    <span className="font-bold">
                      {Math.floor((new Date() - new Date(trackingStats.startTime)) / 60000)} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Interval:</span>
                    <span className="font-bold">{trackingInterval} seconds</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-[500px]">
              <MapContainer
                center={mapCenter}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Current Location Marker */}
                {location && (
                  <Marker 
                    position={[location.latitude, location.longitude]}
                    icon={driverIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <strong className="text-lg">Your Current Location</strong>
                        <br />
                        <span className="text-sm">
                          Accuracy: {accuracy?.toFixed(1) || 'Unknown'}m
                          <br />
                          {speed !== null && speed > 0 && (
                            <>Speed: {(speed * 3.6).toFixed(1)} km/h</>
                          )}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Route History */}
                {routeHistory.length > 1 && (
                  <Polyline
                    positions={routeHistory.map(point => [point.lat, point.lng])}
                    color="#3B82F6"
                    weight={3}
                    opacity={0.7}
                  />
                )}
                
                {/* Parcel Locations */}
                {assignedParcels.map((parcel) => (
                  <Marker
                    key={parcel.id}
                    position={[
                      parcel.pickup_location_lat || (location?.latitude || -1.2921) + 0.001,
                      parcel.pickup_location_lng || (location?.longitude || 36.8219) + 0.001
                    ]}
                    icon={parcelIcon}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <strong>Parcel #{parcel.tracking_number}</strong>
                        <br />
                        <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                          parcel.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                          parcel.status === 'In_Transit' ? 'bg-blue-100 text-blue-800' :
                          parcel.status === 'Out_for_Delivery' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {parcel.status.replace('_', ' ')}
                        </span>
                        <br />
                        {parcel.recipient_name && (
                          <>Recipient: {parcel.recipient_name}<br /></>
                        )}
                        <button
                          onClick={() => handleParcelSelect(parcel)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 w-full"
                        >
                          {activeParcel?.id === parcel.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                
                {/* Auto-recenter component */}
                {location && <RecenterMap center={[location.latitude, location.longitude]} />}
              </MapContainer>
            </div>

            {/* Route History */}
            {routeHistory.length > 0 && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Recent Locations</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left">Time</th>
                        <th className="py-2 px-3 text-left">Latitude</th>
                        <th className="py-2 px-3 text-left">Longitude</th>
                        <th className="py-2 px-3 text-left">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeHistory.slice(-5).reverse().map((point, index) => (
                        <tr key={index} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-3">{new Date(point.timestamp).toLocaleTimeString()}</td>
                          <td className="py-2 px-3 font-mono">{point.lat.toFixed(6)}</td>
                          <td className="py-2 px-3 font-mono">{point.lng.toFixed(6)}</td>
                          <td className="py-2 px-3">{point.accuracy?.toFixed(1) || 'N/A'}m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Parcels */}
        {assignedParcels.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Assigned Parcels ({assignedParcels.length})</h3>
              <button
                onClick={fetchAssignedParcels}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedParcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${
                    activeParcel?.id === parcel.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleParcelSelect(parcel)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-800">#{parcel.tracking_number}</h4>
                      <p className="text-sm text-gray-600">{parcel.recipient_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{parcel.delivery_address}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          parcel.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                          parcel.status === 'In_Transit' ? 'bg-blue-100 text-blue-800' :
                          parcel.status === 'Out_for_Delivery' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {parcel.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    {activeParcel?.id === parcel.id && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        Active
                      </span>
                    )}
                  </div>
                  
                  {activeParcel?.id === parcel.id && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteDelivery();
                        }}
                        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for no parcels */}
        {!loading && assignedParcels.length === 0 && (
          <div className="mt-6 text-center py-8 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Parcels Assigned</h3>
            <p className="text-gray-500">You don't have any parcels assigned for delivery yet.</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-700 mb-2">How GPS Tracking Works:</h3>
        <ul className="list-disc pl-5 text-blue-600 space-y-1 text-sm">
          <li>Click <strong>Start GPS Tracking</strong> to begin automatic location updates</li>
          <li>Your location will be sent to the server every <strong>{trackingInterval} seconds</strong></li>
          <li>All assigned parcels will be updated with your current location automatically</li>
          <li>Keep this browser tab open for continuous tracking</li>
          <li>Select a parcel from the list to mark it as active for delivery</li>
          <li>Click <strong>Mark as Delivered</strong> when you complete a delivery</li>
          <li>Location updates work in the background as long as this tab is open</li>
        </ul>
        <div className="mt-3 text-xs text-blue-500">
          <strong>Note:</strong> Browser-based GPS works best on mobile devices. For continuous background tracking, use our mobile app.
        </div>
      </div>
    </div>
  );
};

export default DriverGPSTracking;
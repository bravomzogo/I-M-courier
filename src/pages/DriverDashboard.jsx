// src/pages/DriverDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTruck, FaMapMarkerAlt, FaClock, FaCheckCircle,
  FaBox, FaUser, FaRoute, FaPhone, FaCar,
  FaPlay, FaPause, FaLocationArrow, FaHistory
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const DriverDashboard = () => {
  const { t, darkMode } = useApp();
  const { user } = useAuth();
  const [driverInfo, setDriverInfo] = useState(null);
  const [assignedParcels, setAssignedParcels] = useState([]);
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchDriverData();
    }
  }, [user]);

  const fetchDriverData = async () => {
    try {
      const [driverResponse, parcelsResponse] = await Promise.all([
        axios.get(`${API_BASE}/driver/dashboard/`),
        axios.get(`${API_BASE}/driver/parcels/`)
      ]);

      setDriverInfo(driverResponse.data);
      setAssignedParcels(parcelsResponse.data);
      
      // If driver has location, set it
      if (driverResponse.data.location?.lat && driverResponse.data.location?.lng) {
        setLocation({
          lat: driverResponse.data.location.lat,
          lng: driverResponse.data.location.lng
        });
      }
    } catch (err) {
      console.error('Failed to fetch driver data:', err);
      setError('Failed to load driver dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setUpdating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Update location on server
          await axios.post(`${API_BASE}/driver/location/update/`, {
            latitude,
            longitude,
            address: 'Current location'
          });

          setLocation({ lat: latitude, lng: longitude });
          setSuccess('Location updated successfully');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
          console.error('Failed to update location:', err);
          setError('Failed to update location');
        } finally {
          setUpdating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Failed to get location: ' + error.message);
        setUpdating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const startTracking = () => {
    if (!location) {
      getCurrentLocation();
    }
    setIsTracking(true);
    setSuccess('Location tracking started');
    setTimeout(() => setSuccess(''), 3000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    setSuccess('Location tracking stopped');
    setTimeout(() => setSuccess(''), 3000);
  };

  const updateParcelStatus = async (parcelId, status) => {
    try {
      await axios.patch(`${API_BASE}/parcels/${parcelId}/`, { status });
      setSuccess(`Parcel status updated to ${status}`);
      
      // Refresh data
      fetchDriverData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update parcel:', err);
      setError('Failed to update parcel status');
    }
  };

  const colors = darkMode ? {
    primary: '#2196F3',
    secondary: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#00BCD4',
    light: '#121212',
    dark: '#FFFFFF',
    cardBg: '#1E1E1E',
    textPrimary: '#FFFFFF',
    gray: '#424242'
  } : {
    primary: '#0D47A1',
    secondary: '#D32F2F',
    success: '#2E7D32',
    warning: '#F57C00',
    info: '#0097A7',
    light: '#FFFFFF',
    dark: '#212121',
    cardBg: '#FFFFFF',
    textPrimary: '#212121',
    gray: '#757575'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return colors.success;
      case 'In_Transit': return colors.info;
      case 'Picked_Up': return colors.warning;
      case 'Out_for_Delivery': return colors.secondary;
      default: return colors.gray;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ backgroundColor: colors.light }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                Driver Dashboard
              </h1>
              <p className="text-lg" style={{ color: colors.gray }}>
                Welcome, {driverInfo?.driver_info?.user_details?.first_name || 'Driver'}!
              </p>
            </div>
            
            <div className="flex space-x-3">
              <span 
                className="px-4 py-2 rounded-full font-bold flex items-center"
                style={{ 
                  backgroundColor: driverInfo?.is_available ? colors.success : colors.warning,
                  color: '#FFFFFF'
                }}
              >
                <FaTruck className="w-4 h-4 mr-2" />
                {driverInfo?.is_available ? 'Available' : 'Unavailable'}
              </span>
              
              <span 
                className="px-4 py-2 rounded-full font-bold flex items-center"
                style={{ 
                  backgroundColor: colors.primary,
                  color: '#FFFFFF'
                }}
              >
                <FaBox className="w-4 h-4 mr-2" />
                {assignedParcels.length} Assigned
              </span>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-lg flex items-center"
            style={{ 
              backgroundColor: colors.secondary + '20',
              border: `1px solid ${colors.secondary}`
            }}
          >
            <span style={{ color: colors.textPrimary }}>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-lg flex items-center"
            style={{ 
              backgroundColor: colors.success + '20',
              border: `1px solid ${colors.success}`
            }}
          >
            <FaCheckCircle className="w-5 h-5 mr-3" style={{ color: colors.success }} />
            <span style={{ color: colors.textPrimary }}>{success}</span>
          </motion.div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Driver Info & Controls */}
          <div className="space-y-6">
            {/* Driver Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ 
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.primary}`
              }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.textPrimary }}>
                <FaUser className="w-5 h-5 mr-2" />
                Driver Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Name:</span>
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    {driverInfo?.driver_info?.user_details?.first_name} {driverInfo?.driver_info?.user_details?.last_name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Phone:</span>
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    <FaPhone className="inline w-3 h-3 mr-1" />
                    {driverInfo?.driver_info?.phone_number}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Vehicle:</span>
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    <FaCar className="inline w-3 h-3 mr-1" />
                    {driverInfo?.driver_info?.vehicle_registration || 'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>License:</span>
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    {driverInfo?.driver_info?.license_number || 'Not set'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Status:</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ 
                      backgroundColor: driverInfo?.is_available ? colors.success : colors.warning,
                      color: '#FFFFFF'
                    }}
                  >
                    {driverInfo?.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Location Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ 
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.info}`
              }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.textPrimary }}>
                <FaLocationArrow className="w-5 h-5 mr-2" />
                Location Tracking
              </h2>
              
              {location ? (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ color: colors.gray }}>Current Location:</span>
                    <span className="text-sm" style={{ color: colors.textPrimary }}>
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.gray + '10' }}>
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="w-5 h-5" style={{ color: colors.primary }} />
                      <div>
                        <p className="font-bold" style={{ color: colors.textPrimary }}>
                          Lat: {location.lat.toFixed(6)}
                        </p>
                        <p className="font-bold" style={{ color: colors.textPrimary }}>
                          Lng: {location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-lg text-center" style={{ backgroundColor: colors.gray + '10' }}>
                  <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-3" style={{ color: colors.gray }} />
                  <p style={{ color: colors.gray }}>Location not available</p>
                </div>
              )}

              <div className="space-y-3">
                <motion.button
                  onClick={getCurrentLocation}
                  disabled={updating}
                  className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#FFFFFF'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {updating ? (
                    'Getting Location...'
                  ) : (
                    <>
                      <FaLocationArrow className="w-5 h-5 mr-2" />
                      Update Location
                    </>
                  )}
                </motion.button>

                {!isTracking ? (
                  <motion.button
                    onClick={startTracking}
                    className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                    style={{ 
                      backgroundColor: colors.success,
                      color: '#FFFFFF'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPlay className="w-5 h-5 mr-2" />
                    Start Tracking
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={stopTracking}
                    className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: '#FFFFFF'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaPause className="w-5 h-5 mr-2" />
                    Stop Tracking
                  </motion.button>
                )}
              </div>
            </motion.div>

            {/* Today's Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ 
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.success}`
              }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.textPrimary }}>
                <FaClock className="w-5 h-5 mr-2" />
                Today's Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Assigned Parcels:</span>
                  <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                    {driverInfo?.assigned_parcels_count || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Today's Deliveries:</span>
                  <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                    {driverInfo?.today_deliveries_count || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: colors.gray }}>Completed Today:</span>
                  <span className="font-bold text-lg" style={{ color: colors.success }}>
                    {driverInfo?.completed_today_count || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Assigned Parcels */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ 
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.warning}`
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center" style={{ color: colors.textPrimary }}>
                  <FaBox className="w-5 h-5 mr-2" />
                  Assigned Parcels ({assignedParcels.length})
                </h2>
                
                <div className="flex space-x-2">
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ 
                      backgroundColor: colors.info,
                      color: '#FFFFFF'
                    }}
                  >
                    <FaRoute className="inline w-3 h-3 mr-1" />
                    In Transit: {assignedParcels.filter(p => p.status === 'In_Transit').length}
                  </span>
                </div>
              </div>

              {assignedParcels.length > 0 ? (
                <div className="space-y-4">
                  {assignedParcels.map((parcel) => (
                    <motion.div
                      key={parcel.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: colors.lightGray,
                        border: `2px solid ${getStatusColor(parcel.status)}`
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Parcel Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="font-bold" style={{ color: colors.textPrimary }}>
                              #{parcel.tracking_number}
                            </span>
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: getStatusColor(parcel.status),
                                color: '#FFFFFF'
                              }}
                            >
                              {parcel.status?.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold" style={{ color: colors.gray }}>Route</p>
                              <div className="flex items-center mt-1">
                                <FaMapMarkerAlt className="w-3 h-3 mr-1" style={{ color: colors.primary }} />
                                <span className="text-sm" style={{ color: colors.textPrimary }}>
                                  {parcel.pickup_location} → {parcel.delivery_location}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-semibold" style={{ color: colors.gray }}>Details</p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm" style={{ color: colors.textPrimary }}>
                                  {parcel.weight} kg
                                </span>
                                <span className="text-sm" style={{ color: colors.textPrimary }}>
                                  {parcel.service_details?.name || 'Standard'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Customer Info */}
                          <div className="mt-4">
                            <p className="text-sm font-semibold" style={{ color: colors.gray }}>Customer</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm" style={{ color: colors.textPrimary }}>
                                {parcel.receiver_name}
                              </span>
                              <span className="text-sm" style={{ color: colors.gray }}>
                                {parcel.receiver_phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          {/* Status Actions */}
                          <div className="flex space-x-2">
                            {parcel.status === 'Assigned' && (
                              <motion.button
                                onClick={() => updateParcelStatus(parcel.id, 'Picked_Up')}
                                className="px-4 py-2 rounded-lg text-sm font-bold"
                                style={{ 
                                  backgroundColor: colors.warning,
                                  color: '#FFFFFF'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Mark Picked Up
                              </motion.button>
                            )}
                            
                            {parcel.status === 'Picked_Up' && (
                              <motion.button
                                onClick={() => updateParcelStatus(parcel.id, 'In_Transit')}
                                className="px-4 py-2 rounded-lg text-sm font-bold"
                                style={{ 
                                  backgroundColor: colors.info,
                                  color: '#FFFFFF'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Start Delivery
                              </motion.button>
                            )}
                            
                            {parcel.status === 'In_Transit' && (
                              <motion.button
                                onClick={() => updateParcelStatus(parcel.id, 'Out_for_Delivery')}
                                className="px-4 py-2 rounded-lg text-sm font-bold"
                                style={{ 
                                  backgroundColor: colors.secondary,
                                  color: '#FFFFFF'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Out for Delivery
                              </motion.button>
                            )}
                            
                            {parcel.status === 'Out_for_Delivery' && (
                              <motion.button
                                onClick={() => updateParcelStatus(parcel.id, 'Delivered')}
                                className="px-4 py-2 rounded-lg text-sm font-bold"
                                style={{ 
                                  backgroundColor: colors.success,
                                  color: '#FFFFFF'
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Mark Delivered
                              </motion.button>
                            )}
                          </div>

                          {/* View Details */}
                          <a 
                            href={`/track/${parcel.tracking_number}`}
                            className="text-sm font-semibold text-center hover:underline"
                            style={{ color: colors.primary }}
                          >
                            View Details →
                          </a>
                          
                          {/* Update Location */}
                          <motion.button
                            onClick={() => {
                              if (location) {
                                // Update this specific parcel's location
                                axios.post(`${API_BASE}/driver/location/update/`, {
                                  latitude: location.lat,
                                  longitude: location.lng,
                                  parcel_id: parcel.id
                                });
                                setSuccess('Parcel location updated');
                                setTimeout(() => setSuccess(''), 3000);
                              } else {
                                setError('Please get your location first');
                              }
                            }}
                            className="px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center"
                            style={{ 
                              backgroundColor: colors.primary,
                              color: '#FFFFFF'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaLocationArrow className="w-3 h-3 mr-1" />
                            Update Location
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaTruck className="w-16 h-16 mx-auto mb-4" style={{ color: colors.gray }} />
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                    No Assigned Parcels
                  </h3>
                  <p style={{ color: colors.gray }}>
                    You don't have any parcels assigned to you yet.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Delivery History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 rounded-xl p-6 shadow-lg"
              style={{ 
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.info}`
              }}
            >
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.textPrimary }}>
                <FaHistory className="w-5 h-5 mr-2" />
                Recent Deliveries
              </h2>
              
              <div className="space-y-3">
                {assignedParcels
                  .filter(p => p.status === 'Delivered')
                  .slice(0, 5)
                  .map((parcel) => (
                    <div key={parcel.id} className="p-3 rounded-lg" style={{ backgroundColor: colors.gray + '10' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold" style={{ color: colors.textPrimary }}>
                            #{parcel.tracking_number}
                          </span>
                          <p className="text-sm" style={{ color: colors.gray }}>
                            {parcel.delivery_location}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold" style={{ color: colors.success }}>
                            Delivered
                          </span>
                          <p className="text-xs" style={{ color: colors.gray }}>
                            {parcel.updated_at ? new Date(parcel.updated_at).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                
                {assignedParcels.filter(p => p.status === 'Delivered').length === 0 && (
                  <p className="text-center py-4" style={{ color: colors.gray }}>
                    No delivery history yet
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
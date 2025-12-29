// src/pages/Approvals.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheck, FaTimes, FaClock, FaExclamationTriangle,
  FaBox, FaUser, FaMapMarkerAlt, FaWeightHanging
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Approvals = () => {
  const { t, darkMode } = useApp();
  const { user } = useAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchPendingApprovals();
    }
  }, [user]);

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get(`${API_BASE}/approvals/pending/`);
      setParcels(response.data);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (parcelId, action, notes = '', rejectionReason = '', driverId = null) => {
    setProcessing({ ...processing, [parcelId]: true });
    setError('');
    setSuccess('');

    try {
      const payload = { action, notes };
      
      if (action === 'reject' && rejectionReason) {
        payload.rejection_reason = rejectionReason;
      }
      
      if (action === 'approve' && driverId) {
        payload.assigned_driver_id = driverId;
      }

      await axios.post(`${API_BASE}/parcels/${parcelId}/approve/`, payload);
      
      setSuccess(`Parcel ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      
      // Refresh the list
      fetchPendingApprovals();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Approval error:', err);
      setError(err.response?.data?.error || 'Failed to process approval');
    } finally {
      setProcessing({ ...processing, [parcelId]: false });
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
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Pending Approvals
          </h1>
          <p className="text-lg" style={{ color: colors.gray }}>
            Review and approve parcel requests
          </p>
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
            <FaExclamationTriangle className="w-5 h-5 mr-3" style={{ color: colors.secondary }} />
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
            <FaCheck className="w-5 h-5 mr-3" style={{ color: colors.success }} />
            <span style={{ color: colors.textPrimary }}>{success}</span>
          </motion.div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-xl p-6 shadow-lg" style={{ 
            backgroundColor: colors.warning + '20',
            border: `2px solid ${colors.warning}`
          }}>
            <div className="flex items-center">
              <div 
                className="p-3 rounded-full mr-4"
                style={{ backgroundColor: colors.warning + '40' }}
              >
                <FaClock className="w-6 h-6" style={{ color: colors.warning }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.gray }}>Pending</p>
                <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                  {parcels.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 shadow-lg" style={{ 
            backgroundColor: colors.info + '20',
            border: `2px solid ${colors.info}`
          }}>
            <div className="flex items-center">
              <div 
                className="p-3 rounded-full mr-4"
                style={{ backgroundColor: colors.info + '40' }}
              >
                <FaBox className="w-6 h-6" style={{ color: colors.info }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.gray }}>This Week</p>
                <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                  {parcels.filter(p => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(p.created_at) > weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 shadow-lg" style={{ 
            backgroundColor: colors.success + '20',
            border: `2px solid ${colors.success}`
          }}>
            <div className="flex items-center">
              <div 
                className="p-3 rounded-full mr-4"
                style={{ backgroundColor: colors.success + '40' }}
              >
                <FaCheck className="w-6 h-6" style={{ color: colors.success }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.gray }}>Approved Today</p>
                <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                  0
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 shadow-lg" style={{ 
            backgroundColor: colors.secondary + '20',
            border: `2px solid ${colors.secondary}`
          }}>
            <div className="flex items-center">
              <div 
                className="p-3 rounded-full mr-4"
                style={{ backgroundColor: colors.secondary + '40' }}
              >
                <FaTimes className="w-6 h-6" style={{ color: colors.secondary }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: colors.gray }}>Rejected Today</p>
                <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                  0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Parcels List */}
        {parcels.length > 0 ? (
          <div className="space-y-6">
            {parcels.map((parcel) => (
              <motion.div
                key={parcel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-6 shadow-lg"
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `2px solid ${colors.primary}`
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Parcel Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-bold text-lg" style={{ color: colors.textPrimary }}>
                            #{parcel.tracking_number}
                          </span>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ 
                              backgroundColor: colors.warning,
                              color: '#FFFFFF'
                            }}
                          >
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: colors.gray }}>
                          Created: {new Date(parcel.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg" style={{ color: colors.primary }}>
                          ${parcel.service_details?.price_per_kg ? 
                            (parcel.service_details.price_per_kg * parcel.weight).toFixed(2) : 
                            '0.00'}
                        </p>
                        <p className="text-sm" style={{ color: colors.gray }}>Estimated Cost</p>
                      </div>
                    </div>

                    {/* Sender & Receiver */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-bold mb-2 flex items-center" style={{ color: colors.textPrimary }}>
                          <FaUser className="w-4 h-4 mr-2" />
                          Sender
                        </h3>
                        <div className="space-y-1">
                          <p style={{ color: colors.textPrimary }}>{parcel.sender_name}</p>
                          <p className="text-sm" style={{ color: colors.gray }}>{parcel.sender_email}</p>
                          <p className="text-sm" style={{ color: colors.gray }}>{parcel.sender_phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold mb-2 flex items-center" style={{ color: colors.textPrimary }}>
                          <FaUser className="w-4 h-4 mr-2" />
                          Receiver
                        </h3>
                        <div className="space-y-1">
                          <p style={{ color: colors.textPrimary }}>{parcel.receiver_name}</p>
                          <p className="text-sm" style={{ color: colors.gray }}>{parcel.receiver_email}</p>
                          <p className="text-sm" style={{ color: colors.gray }}>{parcel.receiver_phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Route & Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-bold mb-2 flex items-center" style={{ color: colors.textPrimary }}>
                          <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                          Route
                        </h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-semibold" style={{ color: colors.gray }}>Pickup</p>
                            <p style={{ color: colors.textPrimary }}>{parcel.pickup_location}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: colors.gray }}>Delivery</p>
                            <p style={{ color: colors.textPrimary }}>{parcel.delivery_location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold mb-2 flex items-center" style={{ color: colors.textPrimary }}>
                          <FaBox className="w-4 h-4 mr-2" />
                          Parcel Details
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span style={{ color: colors.gray }}>Weight:</span>
                            <span style={{ color: colors.textPrimary }}>{parcel.weight} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ color: colors.gray }}>Service:</span>
                            <span style={{ color: colors.textPrimary }}>{parcel.service_details?.name || 'Standard'}</span>
                          </div>
                          {parcel.dimensions && (
                            <div className="flex justify-between">
                              <span style={{ color: colors.gray }}>Dimensions:</span>
                              <span style={{ color: colors.textPrimary }}>{parcel.dimensions}</span>
                            </div>
                          )}
                          {parcel.special_instructions && (
                            <div className="mt-2">
                              <p className="text-sm font-semibold" style={{ color: colors.gray }}>Special Instructions:</p>
                              <p className="text-sm" style={{ color: colors.textPrimary }}>{parcel.special_instructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approval Actions */}
                  <div>
                    <div className="sticky top-24">
                      <h3 className="font-bold mb-4 text-lg" style={{ color: colors.textPrimary }}>
                        Approval Actions
                      </h3>
                      
                      <div className="space-y-4">
                        <motion.button
                          onClick={() => handleApproval(parcel.id, 'approve', 'Parcel approved')}
                          disabled={processing[parcel.id]}
                          className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                          style={{ 
                            backgroundColor: colors.success,
                            color: '#FFFFFF'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {processing[parcel.id] ? (
                            'Processing...'
                          ) : (
                            <>
                              <FaCheck className="w-5 h-5 mr-2" />
                              Approve Parcel
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) {
                              handleApproval(parcel.id, 'reject', '', reason);
                            }
                          }}
                          disabled={processing[parcel.id]}
                          className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                          style={{ 
                            backgroundColor: colors.secondary,
                            color: '#FFFFFF'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {processing[parcel.id] ? (
                            'Processing...'
                          ) : (
                            <>
                              <FaTimes className="w-5 h-5 mr-2" />
                              Reject Parcel
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            const notes = prompt('Enter requested changes:');
                            if (notes) {
                              handleApproval(parcel.id, 'request_changes', notes);
                            }
                          }}
                          disabled={processing[parcel.id]}
                          className="w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center"
                          style={{ 
                            backgroundColor: colors.warning,
                            color: '#FFFFFF'
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {processing[parcel.id] ? (
                            'Processing...'
                          ) : (
                            <>
                              <FaExclamationTriangle className="w-5 h-5 mr-2" />
                              Request Changes
                            </>
                          )}
                        </motion.button>
                      </div>

                      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.gray + '10' }}>
                        <p className="text-sm font-semibold mb-2" style={{ color: colors.textPrimary }}>
                          Quick Notes
                        </p>
                        <textarea
                          placeholder="Add approval notes here..."
                          className="w-full p-3 rounded-lg text-sm"
                          style={{ 
                            backgroundColor: colors.light,
                            color: colors.textPrimary,
                            border: `1px solid ${colors.gray}`
                          }}
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-xl"
            style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.primary}`
            }}
          >
            <FaCheck className="w-16 h-16 mx-auto mb-4" style={{ color: colors.success }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
              No Pending Approvals
            </h3>
            <p style={{ color: colors.gray }}>
              All parcel requests have been processed
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
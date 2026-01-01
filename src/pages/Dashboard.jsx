// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, FaTruck, FaCheckCircle, FaClock, 
  FaDollarSign, FaChartLine, FaExclamationTriangle,
  FaHistory, FaUser, FaMapMarkerAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Dashboard = () => {
  const { user, isDriver, isApprover } = useAuth();
  const { t, darkMode } = useApp();
  const [stats, setStats] = useState(null);
  const [recentParcels, setRecentParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, parcelsResponse] = await Promise.all([
        axios.get(`${API_BASE}/dashboard/`),
        axios.get(`${API_BASE}/user/parcels/`)
      ]);

      setStats(statsResponse.data);
      setRecentParcels(parcelsResponse.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const statCards = [
    {
      title: 'Total Parcels',
      value: stats?.total_parcels || 0,
      icon: <FaBox className="w-6 h-6" />,
      color: colors.primary,
      bgColor: `${colors.primary}20`
    },
    {
      title: 'Pending Approval',
      value: stats?.pending_approval || 0,
      icon: <FaClock className="w-6 h-6" />,
      color: colors.warning,
      bgColor: `${colors.warning}20`
    },
    {
      title: 'Approved Parcels',
      value: stats?.approved_parcels || 0,
      icon: <FaCheckCircle className="w-6 h-6" />,
      color: colors.success,
      bgColor: `${colors.success}20`
    },
    {
      title: 'In Transit',
      value: stats?.in_transit_parcels || 0,
      icon: <FaTruck className="w-6 h-6" />,
      color: colors.info,
      bgColor: `${colors.info}20`
    },
    {
      title: 'Delivered',
      value: stats?.delivered_parcels || 0,
      icon: <FaCheckCircle className="w-6 h-6" />,
      color: colors.success,
      bgColor: `${colors.success}20`
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return colors.success;
      case 'In_Transit': return colors.info;
      case 'Approved': return colors.success;
      case 'Pending': return colors.warning;
      case 'Rejected': return colors.secondary;
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
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <br></br><br></br>
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Welcome back, {user?.first_name || user?.username}!
          </h1>
          <p className="text-lg" style={{ color: colors.gray }}>
            Here's what's happening with your parcels
          </p>
          
          {/* Role Badges */}
          <div className="flex space-x-3 mt-4">
            {isDriver && (
              <span 
                className="px-4 py-2 rounded-full font-bold text-sm"
                style={{ backgroundColor: colors.warning, color: '#FFFFFF' }}
              >
                <FaTruck className="inline mr-2" />
                {t.driver}
              </span>
            )}
            {isApprover && (
              <span 
                className="px-4 py-2 rounded-full font-bold text-sm"
                style={{ backgroundColor: colors.secondary, color: '#FFFFFF' }}
              >
                <FaCheckCircle className="inline mr-2" />
                {t.approver}
              </span>
            )}
          </div>
        </motion.div>

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl p-6 shadow-lg"
              style={{ 
                backgroundColor: stat.bgColor,
                border: `2px solid ${stat.color}`
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: stat.color + '40' }}
                >
                  <div style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: colors.gray }}>
                    {stat.title}
                  </p>
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Parcels */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="rounded-xl p-6 shadow-lg" style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.primary}`
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                  <FaHistory className="inline mr-2" />
                  Recent Parcels
                </h2>
                <a 
                  href="/track" 
                  className="text-sm font-semibold hover:underline"
                  style={{ color: colors.primary }}
                >
                  View All →
                </a>
              </div>

              {recentParcels.length > 0 ? (
                <div className="space-y-4">
                  {recentParcels.map((parcel) => (
                    <motion.div
                      key={parcel.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-lg transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: colors.lightGray,
                        border: `1px solid ${colors.gray}20`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ 
                                backgroundColor: getStatusColor(parcel.status),
                                color: '#FFFFFF'
                              }}
                            >
                              {parcel.status?.replace('_', ' ')}
                            </span>
                            <span className="font-bold" style={{ color: colors.textPrimary }}>
                              {parcel.tracking_number}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm" style={{ color: colors.gray }}>
                              <FaMapMarkerAlt className="w-3 h-3 mr-2" />
                              {parcel.pickup_location} → {parcel.delivery_location}
                            </div>
                            <div className="flex items-center text-sm" style={{ color: colors.gray }}>
                              <FaBox className="w-3 h-3 mr-2" />
                              {parcel.weight} kg • {parcel.service_details?.name || 'Standard'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm" style={{ color: colors.gray }}>
                            {new Date(parcel.created_at).toLocaleDateString()}
                          </div>
                          <a 
                            href={`/track/${parcel.tracking_number}`}
                            className="text-sm font-semibold hover:underline mt-2 inline-block"
                            style={{ color: colors.primary }}
                          >
                            Track →
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBox className="w-16 h-16 mx-auto mb-4" style={{ color: colors.gray }} />
                  <p className="text-lg" style={{ color: colors.gray }}>No parcels yet</p>
                  <p className="text-sm mt-2" style={{ color: colors.gray }}>
                    Book your first delivery to get started
                  </p>
                  <a 
                    href="/book" 
                    className="inline-block mt-4 px-6 py-2 rounded-lg font-bold"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: '#FFFFFF'
                    }}
                  >
                    {t.bookDelivery}
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Quick Actions */}
            <div className="rounded-xl p-6 mb-6 shadow-lg" style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.success}`
            }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                <FaChartLine className="inline mr-2" />
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <a 
                  href="/book" 
                  className="block p-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#FFFFFF'
                  }}
                >
                  {t.bookDelivery}
                </a>
                
                <a 
                  href="/track" 
                  className="block p-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: colors.info,
                    color: '#FFFFFF'
                  }}
                >
                  {t.trackParcel}
                </a>

                {isApprover && (
                  <a 
                    href="/approvals" 
                    className="block p-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: '#FFFFFF'
                    }}
                  >
                    {t.approvals}
                  </a>
                )}

                {isDriver && (
                  <a 
                    href="/driver" 
                    className="block p-4 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: colors.warning,
                      color: '#FFFFFF'
                    }}
                  >
                    {t.driverDashboard}
                  </a>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-xl p-6 shadow-lg" style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.info}`
            }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: colors.textPrimary }}>
                <FaUser className="inline mr-2" />
                Account Info
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm" style={{ color: colors.gray }}>Name</p>
                  <p className="font-bold" style={{ color: colors.textPrimary }}>
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm" style={{ color: colors.gray }}>Email</p>
                  <p className="font-bold" style={{ color: colors.textPrimary }}>
                    {user?.email}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm" style={{ color: colors.gray }}>Username</p>
                  <p className="font-bold" style={{ color: colors.textPrimary }}>
                    {user?.username}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm" style={{ color: colors.gray }}>Account Type</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: colors.success,
                        color: '#FFFFFF'
                      }}
                    >
                      {stats?.role || 'User'}
                    </span>
                    {isDriver && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: colors.warning,
                          color: '#FFFFFF'
                        }}
                      >
                        Driver
                      </span>
                    )}
                    {isApprover && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: colors.secondary,
                          color: '#FFFFFF'
                        }}
                      >
                        Approver
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
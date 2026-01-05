// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, FaTruck, FaCheckCircle, FaClock, 
  FaDollarSign, FaChartLine, FaExclamationTriangle,
  FaHistory, FaUser, FaMapMarkerAlt, FaCalendarAlt,
  FaWeight, FaRoute, FaPhoneAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user, isDriver, isApprover } = useAuth();
  const { t, darkMode } = useApp();
  const [stats, setStats] = useState(null);
  const [recentParcels, setRecentParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError('');

      // Fetch dashboard stats and user parcels in parallel
      const [statsResponse, parcelsResponse] = await Promise.all([
        api.get('/dashboard/'),
        api.get('/user/parcels/')
      ]);

      setStats(statsResponse.data);
      setRecentParcels(parcelsResponse.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          'Failed to load dashboard data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
    gray: '#9E9E9E',
    lightGray: '#2C2C2C',
    border: '#333333'
  } : {
    primary: '#0D47A1',
    secondary: '#D32F2F',
    success: '#2E7D32',
    warning: '#F57C00',
    info: '#0097A7',
    light: '#F5F5F5',
    dark: '#212121',
    cardBg: '#FFFFFF',
    textPrimary: '#212121',
    gray: '#757575',
    lightGray: '#F9F9F9',
    border: '#E0E0E0'
  };

  const statCards = [
    {
      title: 'Total Parcels',
      value: stats?.total_parcels || 0,
      icon: <FaBox className="w-6 h-6" />,
      color: colors.primary,
      bgColor: darkMode ? `${colors.primary}20` : `${colors.primary}15`,
      description: 'All time'
    },
    {
      title: 'Pending Approval',
      value: stats?.pending_approval || 0,
      icon: <FaClock className="w-6 h-6" />,
      color: colors.warning,
      bgColor: darkMode ? `${colors.warning}20` : `${colors.warning}15`,
      description: 'Awaiting review'
    },
    {
      title: 'Approved',
      value: stats?.approved_parcels || 0,
      icon: <FaCheckCircle className="w-6 h-6" />,
      color: colors.success,
      bgColor: darkMode ? `${colors.success}20` : `${colors.success}15`,
      description: 'Ready to ship'
    },
    {
      title: 'In Transit',
      value: stats?.in_transit_parcels || 0,
      icon: <FaTruck className="w-6 h-6" />,
      color: colors.info,
      bgColor: darkMode ? `${colors.info}20` : `${colors.info}15`,
      description: 'On the way'
    },
    {
      title: 'Delivered',
      value: stats?.delivered_parcels || 0,
      icon: <FaCheckCircle className="w-6 h-6" />,
      color: colors.success,
      bgColor: darkMode ? `${colors.success}20` : `${colors.success}15`,
      description: 'Completed'
    },
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      'Delivered': colors.success,
      'In_Transit': colors.info,
      'Approved': colors.success,
      'Pending': colors.warning,
      'Rejected': colors.secondary,
      'Cancelled': colors.gray
    };
    return statusMap[status] || colors.gray;
  };

  const formatStatusText = (status) => {
    return status?.replace(/_/g, ' ') || 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) return 'Just now';
      return `${diffInHours}h ago`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: colors.light }}>
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4" 
            style={{ 
              borderColor: colors.border,
              borderTopColor: colors.primary 
            }}
          ></div>
          <p style={{ color: colors.gray }}>Loading your dashboard...</p>
        </div>
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
        ><br></br><br></br>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                Welcome back, {user?.first_name || user?.username}! 👋
              </h1>
              <p className="text-lg" style={{ color: colors.gray }}>
                Here's what's happening with your parcels today
              </p>
            </div>
            
            <button
              onClick={() => fetchDashboardData()}
              disabled={refreshing}
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ 
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
          
          {/* Role Badges */}
          <div className="flex flex-wrap gap-3 mt-4">
            <span 
              className="px-4 py-2 rounded-full font-semibold text-sm"
              style={{ 
                backgroundColor: darkMode ? colors.cardBg : colors.primary + '15',
                color: colors.primary,
                border: `2px solid ${colors.primary}`
              }}
            >
              <FaUser className="inline mr-2" />
              {stats?.role || 'User'}
            </span>
            {isDriver && (
              <span 
                className="px-4 py-2 rounded-full font-semibold text-sm"
                style={{ 
                  backgroundColor: colors.warning,
                  color: '#FFFFFF'
                }}
              >
                <FaTruck className="inline mr-2" />
                Driver
              </span>
            )}
            {isApprover && (
              <span 
                className="px-4 py-2 rounded-full font-semibold text-sm"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: '#FFFFFF'
                }}
              >
                <FaCheckCircle className="inline mr-2" />
                Approver
              </span>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-lg flex items-start"
            style={{ 
              backgroundColor: darkMode ? colors.secondary + '20' : '#FFEBEE',
              border: `2px solid ${colors.secondary}`
            }}
          >
            <FaExclamationTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" style={{ color: colors.secondary }} />
            <div>
              <p className="font-semibold mb-1" style={{ color: colors.secondary }}>Error Loading Data</p>
              <p style={{ color: colors.textPrimary }}>{error}</p>
              <button
                onClick={() => fetchDashboardData()}
                className="mt-2 text-sm font-semibold hover:underline"
                style={{ color: colors.secondary }}
              >
                Try Again →
              </button>
            </div>
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
              whileHover={{ scale: 1.02 }}
              className="rounded-xl p-6 shadow-lg cursor-pointer"
              style={{ 
                backgroundColor: stat.bgColor,
                border: `2px solid ${stat.color}`
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.color + '30' }}
                >
                  <div style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: colors.textPrimary }}>
                {stat.value}
              </p>
              <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>
                {stat.title}
              </p>
              <p className="text-xs" style={{ color: colors.gray }}>
                {stat.description}
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
              border: `2px solid ${colors.border}`
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center" style={{ color: colors.textPrimary }}>
                  <FaHistory className="mr-2" />
                  Recent Parcels
                </h2>
                <a 
                  href="/track" 
                  className="text-sm font-semibold hover:underline transition-all"
                  style={{ color: colors.primary }}
                >
                  View All →
                </a>
              </div>

              {recentParcels.length > 0 ? (
                <div className="space-y-3">
                  {recentParcels.map((parcel, idx) => (
                    <motion.div
                      key={parcel.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-lg transition-all cursor-pointer"
                      style={{ 
                        backgroundColor: colors.lightGray,
                        border: `1px solid ${colors.border}`
                      }}
                      onClick={() => window.location.href = `/track/${parcel.tracking_number}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                              style={{ 
                                backgroundColor: getStatusColor(parcel.status),
                                color: '#FFFFFF'
                              }}
                            >
                              {formatStatusText(parcel.status)}
                            </span>
                            <span className="font-bold text-sm truncate" style={{ color: colors.textPrimary }}>
                              {parcel.tracking_number}
                            </span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <div className="flex items-start text-sm" style={{ color: colors.gray }}>
                              <FaMapMarkerAlt className="w-3 h-3 mr-2 mt-1 flex-shrink-0" />
                              <span className="truncate">
                                {parcel.pickup_location} → {parcel.delivery_location}
                              </span>
                            </div>
                            
                            <div className="flex items-center flex-wrap gap-3 text-xs" style={{ color: colors.gray }}>
                              <span className="flex items-center">
                                <FaWeight className="w-3 h-3 mr-1" />
                                {parcel.weight} kg
                              </span>
                              <span className="flex items-center">
                                <FaRoute className="w-3 h-3 mr-1" />
                                {parcel.service_details?.name || 'Standard'}
                              </span>
                              {parcel.recipient_phone && (
                                <span className="flex items-center">
                                  <FaPhoneAlt className="w-3 h-3 mr-1" />
                                  {parcel.recipient_phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs mb-2 flex items-center justify-end" style={{ color: colors.gray }}>
                            <FaCalendarAlt className="w-3 h-3 mr-1" />
                            {formatDate(parcel.created_at)}
                          </div>
                          <button 
                            className="text-xs font-semibold hover:underline px-3 py-1 rounded transition-all"
                            style={{ 
                              color: colors.primary,
                              backgroundColor: darkMode ? colors.primary + '20' : colors.primary + '10'
                            }}
                          >
                            Track →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div 
                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.lightGray }}
                  >
                    <FaBox className="w-10 h-10" style={{ color: colors.gray }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                    No parcels yet
                  </h3>
                  <p className="text-sm mb-4" style={{ color: colors.gray }}>
                    Book your first delivery to get started with our service
                  </p>
                  <a 
                    href="/book" 
                    className="inline-block px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: '#FFFFFF'
                    }}
                  >
                    📦 Book Your First Delivery
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="rounded-xl p-6 shadow-lg" style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.border}`
            }}>
              <h2 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.textPrimary }}>
                <FaChartLine className="mr-2" />
                Quick Actions
              </h2>
              
              <div className="space-y-2.5">
                <a 
                  href="/book" 
                  className="block p-3.5 rounded-lg font-semibold text-center transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#FFFFFF'
                  }}
                >
                  📦 Book Delivery
                </a>
                
                <a 
                  href="/track" 
                  className="block p-3.5 rounded-lg font-semibold text-center transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{ 
                    backgroundColor: colors.info,
                    color: '#FFFFFF'
                  }}
                >
                  🔍 Track Parcel
                </a>

                {isApprover && (
                  <a 
                    href="/approvals" 
                    className="block p-3.5 rounded-lg font-semibold text-center transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: '#FFFFFF'
                    }}
                  >
                    ✅ Approvals
                    {stats?.pending_approval > 0 && (
                      <span 
                        className="ml-2 px-2 py-0.5 rounded-full text-xs"
                        style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
                      >
                        {stats.pending_approval}
                      </span>
                    )}
                  </a>
                )}

                {isDriver && (
                  <a 
                    href="/driver" 
                    className="block p-3.5 rounded-lg font-semibold text-center transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: colors.warning,
                      color: '#FFFFFF'
                    }}
                  >
                    🚚 Driver Dashboard
                  </a>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-xl p-6 shadow-lg" style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.border}`
            }}>
              <h2 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.textPrimary }}>
                <FaUser className="mr-2" />
                Account Info
              </h2>
              
              <div className="space-y-3.5">
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: colors.gray }}>
                    FULL NAME
                  </p>
                  <p className="font-bold" style={{ color: colors.textPrimary }}>
                    {user?.first_name} {user?.last_name}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: colors.gray }}>
                    EMAIL ADDRESS
                  </p>
                  <p className="font-bold text-sm truncate" style={{ color: colors.textPrimary }}>
                    {user?.email}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold mb-1" style={{ color: colors.gray }}>
                    USERNAME
                  </p>
                  <p className="font-bold" style={{ color: colors.textPrimary }}>
                    {user?.username}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: colors.gray }}>
                    ACCOUNT ROLES
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span 
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: darkMode ? colors.success + '30' : colors.success + '20',
                        color: colors.success,
                        border: `1px solid ${colors.success}`
                      }}
                    >
                      {stats?.role || 'User'}
                    </span>
                    {isDriver && (
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-bold"
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
                        className="px-3 py-1.5 rounded-full text-xs font-bold"
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
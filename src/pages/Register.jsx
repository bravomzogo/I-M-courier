// pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Register = () => {
  const { t, darkMode } = useApp();
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password,
        password2: formData.password2
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        if (typeof result.error === 'object') {
          setErrors(result.error);
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const colors = darkMode ? {
    primary: '#2196F3',
    secondary: '#F44336',
    success: '#4CAF50',
    light: '#121212',
    dark: '#FFFFFF',
    cardBg: '#1E1E1E',
    textPrimary: '#FFFFFF'
  } : {
    primary: '#0D47A1',
    secondary: '#D32F2F',
    success: '#2E7D32',
    light: '#FFFFFF',
    dark: '#212121',
    cardBg: '#FFFFFF',
    textPrimary: '#212121'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-4"
      >
        <div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          style={{ border: `2px solid ${colors.primary}` }}
        >
          {/* Header */}
          <div 
            className="p-8 text-center"
            style={{ backgroundColor: colors.primary }}
          >
            <h1 className="text-2xl font-bold text-white">{t.register}</h1>
            <p className="text-white opacity-90 mt-2">
              Create your I&M Courier account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div 
                className="mb-6 p-4 rounded-lg"
                style={{ 
                  backgroundColor: colors.secondary + '20',
                  border: `1px solid ${colors.secondary}`
                }}
              >
                <div className="text-red-600 font-medium">{error}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
                    borderColor: errors.first_name ? colors.secondary : colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
                    borderColor: errors.last_name ? colors.secondary : colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
                    borderColor: errors.username ? colors.secondary : colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
                    borderColor: errors.email ? colors.secondary : colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
                    borderColor: errors.password ? colors.secondary : colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: darkMode ? '#2D2D2D' : '#F9FAFB',
                    borderColor: errors.password2 ? colors.secondary : colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Confirm your password"
                />
                {errors.password2 && (
                  <p className="text-red-500 text-sm mt-1">{errors.password2}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all disabled:opacity-70"
                style={{ backgroundColor: colors.success }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating Account...' : t.register}
              </motion.button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p style={{ color: colors.textPrimary }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold"
                  style={{ color: colors.primary }}
                >
                  {t.login}
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 text-center border-t border-gray-200 dark:border-gray-700">
            <p 
              className="text-sm"
              style={{ color: colors.textPrimary }}
            >
              By registering, you agree to our{' '}
              <a href="/terms" className="font-semibold" style={{ color: colors.primary }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="font-semibold" style={{ color: colors.primary }}>
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
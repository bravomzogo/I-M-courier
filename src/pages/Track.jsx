// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

// COMPONENT DEFINITION - This is what was missing
const Login = () => {
  const { t, darkMode } = useApp();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
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
    light: '#121212',
    dark: '#FFFFFF',
    cardBg: '#1E1E1E',
    textPrimary: '#FFFFFF'
  } : {
    primary: '#0D47A1',
    secondary: '#D32F2F',
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
        className="w-full max-w-md mx-4"
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
            <h1 className="text-2xl font-bold text-white">{t.login}</h1>
            <p className="text-white opacity-90 mt-2">
              Access your I&M Courier account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div 
                className="mb-6 p-4 rounded-lg flex items-center"
                style={{ 
                  backgroundColor: colors.secondary + '20',
                  border: `1px solid ${colors.secondary}`
                }}
              >
                <div className="text-red-600 font-medium">{error}</div>
              </div>
            )}

            <div className="space-y-6">
              {/* Username/Email */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Username or Email
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
                    borderColor: colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Enter your username or email"
                />
              </div>

              {/* Password */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Password
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
                    borderColor: colors.primary,
                    color: colors.textPrimary
                  }}
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-bold text-white transition-all disabled:opacity-70"
                style={{ backgroundColor: colors.primary }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Logging in...' : t.login}
              </motion.button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span 
                    className="px-2"
                    style={{ 
                      backgroundColor: darkMode ? '#1E1E1E' : '#FFFFFF',
                      color: colors.textPrimary 
                    }}
                  >
                    Don't have an account?
                  </span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link
                  to="/register"
                  className="inline-block px-6 py-3 rounded-lg font-bold transition-all"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: '#FFFFFF'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.register}
                </Link>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 text-center border-t border-gray-200 dark:border-gray-700">
            <p 
              className="text-sm"
              style={{ color: colors.textPrimary }}
            >
              By logging in, you agree to our{' '}
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

// EXPORT STATEMENT - This should be line 123
export default Login;
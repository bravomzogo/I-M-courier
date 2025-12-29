// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [isApprover, setIsApprover] = useState(false);

  // Configure axios
  axios.defaults.baseURL = API_BASE;
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/auth/profile/');
      const userData = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      setIsDriver(userData.is_driver || false);
      setIsApprover(userData.is_approver || false);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Clear invalid tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      setIsDriver(false);
      setIsApprover(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login function - supports both username and email
   * @param {string} credential - username or email
   * @param {string} password
   */
  const login = async (credential, password) => {
    try {
      const trimmedCredential = credential.trim();

      if (!trimmedCredential || !password) {
        return {
          success: false,
          error: 'Please enter both credential and password.',
        };
      }

      const response = await axios.post('/auth/login/', {
        username: trimmedCredential,
        email: trimmedCredential,     // Send both for full compatibility
        password: password,
      });

      const { access, refresh, user: userData } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access);
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      setIsDriver(userData.is_driver || false);
      setIsApprover(userData.is_approver || false);

      return { success: true, data: userData };
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.data) {
        const data = error.response.data;
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = data.non_field_errors.join(' ');
        } else if (typeof data === 'object') {
          errorMessage = Object.values(data).flat().join(' ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register/', userData);

      const { access, refresh, user } = response.data;

      localStorage.setItem('access_token', access);
      if (refresh) localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      setUser(user);
      setIsAuthenticated(true);
      setIsDriver(user.is_driver || false);
      setIsApprover(user.is_approver || false);

      return { success: true, data: user };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];

    setUser(null);
    setIsAuthenticated(false);
    setIsDriver(false);
    setIsApprover(false);
  };

  const updateProfile = async (updateData) => {
    try {
      const response = await axios.put('/auth/profile/', updateData);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data || 'Update failed',
      };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isDriver,
    isApprover,
    login,
    register,
    logout,
    updateProfile,
    fetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
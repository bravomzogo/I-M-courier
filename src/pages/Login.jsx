// src/pages/Login.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope,     // For email field
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaTruck,
  FaShieldAlt,
  FaUser          // For feature icon (customer support)
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import api, { setAuthTokens } from '../utils/api';

// Translations - Email only
const translations = {
  en: {
    login: "Login",
    welcome: "Welcome Back",
    subtitle: "Sign in to access your account",
    email: "Email Address",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password?",
    loginButton: "Sign In",
    noAccount: "Don't have an account?",
    register: "Register",
    or: "Or",
    continueAsGuest: "Continue as Guest",
    enterEmail: "Enter your email address",
    enterPassword: "Enter your password",
    loggingIn: "Signing in...",
    // Features
    feature1: "Track your packages in real-time",
    feature2: "Secure and reliable delivery",
    feature3: "24/7 customer support",
  },
  sw: {
    login: "Ingia",
    welcome: "Karibu Tena",
    subtitle: "Ingia kufikia akaunti yako",
    email: "Barua Pepe",
    password: "Nywila",
    rememberMe: "Nikumbuke",
    forgotPassword: "Umesahau Nywila?",
    loginButton: "Ingia",
    noAccount: "Huna akaunti?",
    register: "Jisajili",
    or: "Au",
    continueAsGuest: "Endelea kama Mgeni",
    enterEmail: "Weka barua pepe yako",
    enterPassword: "Weka nywila yako",
    loggingIn: "Inaingia...",
    // Features
    feature1: "Fuatilia mizigo yako wakati halisi",
    feature2: "Usafirishaji salama na wa kuaminika",
    feature3: "Msaada wa wateja 24/7",
  }
};

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
};

const Login = () => {
  const { darkMode, language } = useApp();
  const t = translations[language];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Color scheme
  const colors = darkMode ? {
    primary: '#2196F3',
    secondary: '#F44336',
    bg: '#121212',
    cardBg: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    inputBg: '#2A2A2A'
  } : {
    primary: '#0D47A1',
    secondary: '#D32F2F',
    bg: '#FFFFFF',
    cardBg: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    inputBg: '#F5F5F5'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login/', {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { access, refresh, user } = response.data;

      setAuthTokens(access, refresh);
      localStorage.setItem('user', JSON.stringify(user));

      if (formData.rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }

      // Immediate redirect
      if (user.role === 'driver' || user.is_driver) {
        navigate('/driver', { replace: true });
      } else if (user.role === 'admin' || user.is_staff || user.is_superuser) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data) {
        errorMessage = Object.values(err.response.data).flat().join(' ');
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <motion.div
          variants={slideIn}
          initial="hidden"
          animate="visible"
          className="hidden lg:block"
        >
          <div className="space-y-6">
            <div>
              <h1 
                className="text-5xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                I&M COURIER
              </h1>
              <p 
                className="text-xl"
                style={{ color: colors.textSecondary }}
              >
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-4 mt-8">
              {[
                { icon: <FaTruck />, text: t.feature1 },
                { icon: <FaShieldAlt />, text: t.feature2 },
                { icon: <FaUser />, text: t.feature3 }  // Now FaUser is imported!
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 + 0.5 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                  >
                    {feature.icon}
                  </div>
                  <p style={{ color: colors.text }}>{feature.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <div 
            className="p-8 rounded-2xl shadow-2xl"
            style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.border}`
            }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6 text-center">
              <h1 
                className="text-3xl font-bold"
                style={{ color: colors.primary }}
              >
                I&M COURIER
              </h1>
            </div>

            <div className="mb-8">
              <h2 
                className="text-3xl font-bold mb-2"
                style={{ color: colors.text }}
              >
                {t.welcome}
              </h2>
              <p style={{ color: colors.textSecondary }}>
                {t.subtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg flex items-center"
                style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  {t.email}
                </label>
                <div className="relative">
                  <div 
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    style={{ color: colors.textSecondary }}
                  >
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder={t.enterEmail}
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.text,
                      '--tw-ring-color': colors.primary
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  {t.password}
                </label>
                <div className="relative">
                  <div 
                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                    style={{ color: colors.textSecondary }}
                  >
                    <FaLock />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder={t.enterPassword}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
                    style={{
                      backgroundColor: colors.inputBg,
                      borderColor: colors.border,
                      color: colors.text,
                      '--tw-ring-color': colors.primary
                    }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    style={{ color: colors.textSecondary }}
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: colors.primary }}
                    disabled={isLoading}
                  />
                  <span 
                    className="ml-2 text-sm"
                    style={{ color: colors.text }}
                  >
                    {t.rememberMe}
                  </span>
                </label>
                <Link 
                  to="/forgot-password"
                  className="text-sm hover:underline"
                  style={{ color: colors.primary }}
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center"
                style={{
                  backgroundColor: isLoading ? `${colors.primary}80` : colors.primary,
                  color: '#FFFFFF',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.loggingIn}
                  </>
                ) : (
                  t.loginButton
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: colors.border }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span 
                    className="px-2"
                    style={{ backgroundColor: colors.cardBg, color: colors.textSecondary }}
                  >
                    {t.or}
                  </span>
                </div>
              </div>

              {/* Continue as Guest */}
              <motion.button
                type="button"
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-bold border-2 transition-all duration-300"
                style={{
                  borderColor: colors.border,
                  color: colors.text,
                  backgroundColor: 'transparent',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {t.continueAsGuest}
              </motion.button>

              {/* Register Link */}
              <p className="text-center text-sm" style={{ color: colors.textSecondary }}>
                {t.noAccount}{' '}
                <Link 
                  to="/register"
                  className="font-bold hover:underline"
                  style={{ color: colors.primary }}
                >
                  {t.register}
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
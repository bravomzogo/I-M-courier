import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logoo.png';
import { 
  FaSun, FaMoon, FaGlobe, 
  FaUser, FaSignOutAlt, FaUserCircle,
  FaTachometerAlt, FaClipboardCheck, FaTruck, FaBars, FaTimes
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { darkMode, language, t, toggleDarkMode, toggleLanguage } = useApp();
  const { user, logout, isAuthenticated, isDriver, isApprover } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Simplified color schemes
  const lightColors = {
    bg: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#666666',
    primary: '#0D47A1',
    secondary: '#D32F2F',
    hover: '#F5F5F5',
    border: '#E0E0E0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  };

  const darkColors = {
    bg: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    primary: '#2196F3',
    secondary: '#F44336',
    hover: '#2A2A2A',
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)'
  };

  const colors = darkMode ? darkColors : lightColors;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // Simplified navigation
  const navItems = [
    { path: "/", label: t.home },
    { path: "/services", label: t.services },
    { path: "/pricing", label: t.pricing },
    { path: "/track", label: t.track },
    { path: "/contact", label: t.contact }
  ];

  // Add authenticated routes
  if (isAuthenticated) {
    navItems.push({ path: "/dashboard", label: t.dashboard });
  }
  if (isApprover) {
    navItems.push({ path: "/approvals", label: t.approvals });
  }
  if (isDriver) {
    navItems.push({ path: "/driver", label: t.driver });
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: colors.bg,
          borderBottom: isScrolled ? `1px solid ${colors.border}` : 'none',
          boxShadow: isScrolled ? `0 2px 10px ${colors.shadow}` : 'none',
          padding: isScrolled ? '0.75rem 0' : '1rem 0'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img 
                  src={logo} 
                  alt="I&M Courier"
                  className="h-10 w-auto"
                />
                <div className="ml-3 hidden sm:block">
                  <h1 
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    {t.company}
                  </h1>
                  <p 
                    className="text-xs"
                    style={{ color: colors.textSecondary }}
                  >
                    {t.tagline}
                  </p>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive(item.path) ? colors.primary : colors.text,
                    backgroundColor: isActive(item.path) ? colors.hover : 'transparent',
                    fontWeight: isActive(item.path) ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hidden sm:flex items-center space-x-1"
                style={{ 
                  backgroundColor: colors.hover,
                  color: colors.text
                }}
              >
                <FaGlobe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {language === 'en' ? 'EN' : 'SW'}
                </span>
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg"
                style={{ 
                  backgroundColor: colors.hover,
                  color: colors.text
                }}
              >
                {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </motion.button>

              {/* User Menu (Desktop) */}
              <div className="hidden lg:block relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  style={{
                    backgroundColor: isAuthenticated ? colors.primary : colors.hover,
                    color: isAuthenticated ? '#FFFFFF' : colors.text
                  }}
                >
                  <FaUser className="w-4 h-4" />
                  <span className="text-sm">
                    {isAuthenticated ? user?.first_name || user?.username : t.login}
                  </span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden"
                      style={{
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      {isAuthenticated ? (
                        <>
                          <button
                            onClick={() => {
                              navigate('/dashboard');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors"
                            style={{ color: colors.text }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <FaTachometerAlt className="w-4 h-4" />
                            <span>{t.dashboard}</span>
                          </button>
                          
                          {isApprover && (
                            <button
                              onClick={() => {
                                navigate('/approvals');
                                setUserMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors"
                              style={{ color: colors.text }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <FaClipboardCheck className="w-4 h-4" />
                              <span>{t.approvals}</span>
                            </button>
                          )}

                          {isDriver && (
                            <button
                              onClick={() => {
                                navigate('/driver');
                                setUserMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors"
                              style={{ color: colors.text }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <FaTruck className="w-4 h-4" />
                              <span>{t.driver}</span>
                            </button>
                          )}

                          <div className="h-px" style={{ backgroundColor: colors.border }} />
                          
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors"
                            style={{ color: colors.secondary }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span>{t.logout}</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              navigate('/login');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors"
                            style={{ color: colors.text }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <FaUser className="w-4 h-4" />
                            <span>{t.login}</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate('/register');
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors"
                            style={{ color: colors.text }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = colors.hover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            <FaUserCircle className="w-4 h-4" />
                            <span>{t.register}</span>
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 rounded-lg"
                style={{ 
                  backgroundColor: colors.hover,
                  color: colors.text
                }}
              >
                {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-full shadow-xl"
              style={{ backgroundColor: colors.bg }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    {t.menu || 'Menu'}
                  </h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: colors.hover }}
                  >
                    <FaTimes className="w-5 h-5" style={{ color: colors.text }} />
                  </button>
                </div>

                {/* User Info */}
                {isAuthenticated && (
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.hover }}>
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <FaUserCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: colors.text }}>
                          {user?.first_name || user?.username}
                        </p>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="space-y-1 mb-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg font-medium transition-colors"
                      style={{
                        color: isActive(item.path) ? colors.primary : colors.text,
                        backgroundColor: isActive(item.path) ? colors.hover : 'transparent'
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className="w-full px-4 py-3 rounded-lg flex items-center space-x-3 mb-2"
                  style={{ 
                    backgroundColor: colors.hover,
                    color: colors.text
                  }}
                >
                  <FaGlobe className="w-5 h-5" />
                  <span>{language === 'en' ? 'Switch to Swahili' : 'Badili kwa Kiingereza'}</span>
                </button>

                {/* Auth Actions */}
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg flex items-center space-x-3"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: '#FFFFFF'
                    }}
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>{t.logout}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-3"
                      style={{ 
                        backgroundColor: colors.primary,
                        color: '#FFFFFF'
                      }}
                    >
                      <FaUser className="w-5 h-5" />
                      <span>{t.login}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg flex items-center justify-center space-x-3"
                      style={{ 
                        backgroundColor: colors.hover,
                        color: colors.text,
                        border: `1px solid ${colors.border}`
                      }}
                    >
                      <FaUserCircle className="w-5 h-5" />
                      <span>{t.register}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div style={{ height: isScrolled ? '64px' : '72px' }} />
    </>
  );
};

export default Header;
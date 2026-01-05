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
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const lightColors = {
    primary: '#0D47A1',
    secondary: '#D32F2F',
    success: '#2E7D32',
    bg: '#FFFFFF',
    text: '#212121',
    textSecondary: '#616161',
    border: '#E0E0E0',
    hover: '#F5F5F5'
  };

  const darkColors = {
    primary: '#2196F3',
    secondary: '#F44336',
    success: '#4CAF50',
    bg: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    hover: '#2A2A2A'
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

  const mainNavItems = [
    { path: "/", label: t.home },
    { path: "/services", label: t.services },
    { path: "/pricing", label: t.pricing },
    { path: "/track", label: t.track },
    { path: "/contact", label: t.contact }
  ];

  const userNavItems = [
    ...(isAuthenticated ? [
      { path: "/dashboard", label: t.dashboard, icon: FaTachometerAlt },
      ...(isApprover ? [{ path: "/approvals", label: t.approvals, icon: FaClipboardCheck }] : []),
      ...(isDriver ? [{ path: "/driver", label: t.driverDashboard, icon: FaTruck }] : [])
    ] : [])
  ];

  const isActive = (path) => location.pathname === path;

  // Vibration variants for header
  const headerVariants = {
    initial: { y: -100 },
    animate: { 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    vibrate: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  return (
    <>
      <motion.header 
        variants={headerVariants}
        initial="initial"
        animate={["animate", "vibrate"]}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
        style={{
          backgroundColor: colors.bg,
          borderBottom: `1px solid ${colors.border}`
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setLogoModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full overflow-hidden"
                style={{ border: `2px solid ${colors.primary}` }}
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: colors.primary }}>
                  {t.company}
                </h1>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {t.tagline}
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive(item.path) ? colors.primary : colors.text,
                      backgroundColor: isActive(item.path) ? colors.primary + '10' : 'transparent',
                      fontWeight: isActive(item.path) ? '600' : '500'
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Desktop User Menu */}
              {isAuthenticated && (
                <motion.div 
                  className="hidden lg:flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {userNavItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Link
                        to={item.path}
                        className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                        style={{
                          color: isActive(item.path) ? colors.primary : colors.textSecondary,
                          backgroundColor: isActive(item.path) ? colors.primary + '10' : 'transparent'
                        }}
                        title={item.label}
                      >
                        <item.icon className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Theme & Language */}
              <div className="hidden sm:flex items-center space-x-2">
                <motion.button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg"
                  style={{ 
                    backgroundColor: colors.hover,
                    color: colors.text
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 180,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle theme"
                >
                  {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  onClick={toggleLanguage}
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: colors.hover,
                    color: colors.text
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: [0, -2, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === 'en' ? 'SW' : 'EN'}
                </motion.button>
              </div>

              {/* User Button */}
              <div className="hidden lg:block relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <motion.button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: colors.primary,
                        color: '#FFFFFF'
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaUserCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {user?.first_name || user?.username}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl overflow-hidden"
                          style={{
                            backgroundColor: colors.bg,
                            border: `1px solid ${colors.border}`
                          }}
                        >
                          <div className="p-2">
                            <Link
                              to="/dashboard"
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: colors.hover }}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <FaTachometerAlt className="w-4 h-4" style={{ color: colors.text }} />
                              <span style={{ color: colors.text }}>{t.dashboard}</span>
                            </Link>
                          </div>
                          <div className="h-px" style={{ backgroundColor: colors.border }} />
                          <div className="p-2">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: colors.hover }}
                            >
                              <FaSignOutAlt className="w-4 h-4" style={{ color: colors.secondary }} />
                              <span style={{ color: colors.text }}>{t.logout}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: '#FFFFFF'
                      }}
                    >
                      {t.login}
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg"
                style={{ 
                  backgroundColor: colors.hover,
                  color: colors.text
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  rotate: mobileMenuOpen ? 90 : 0
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden overflow-hidden"
            style={{
              backgroundColor: colors.bg,
              borderBottom: `1px solid ${colors.border}`
            }}
          >
            <div className="container mx-auto px-4 py-4">
              {/* User Info */}
              {isAuthenticated && (
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="mb-4 p-4 rounded-lg"
                  style={{ backgroundColor: colors.hover }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FaUserCircle className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-medium" style={{ color: colors.text }}>
                        {user?.first_name || user?.username}
                      </p>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                {[...mainNavItems, ...userNavItems].map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg"
                      style={{
                        backgroundColor: isActive(item.path) ? colors.primary + '10' : 'transparent',
                        color: isActive(item.path) ? colors.primary : colors.text
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Actions */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 space-y-2" 
                style={{ borderTop: `1px solid ${colors.border}` }}
              >
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={toggleDarkMode}
                    className="flex-1 p-3 rounded-lg font-medium"
                    style={{ 
                      backgroundColor: colors.hover,
                      color: colors.text
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {darkMode ? <FaSun className="w-5 h-5 mx-auto" /> : <FaMoon className="w-5 h-5 mx-auto" />}
                  </motion.button>
                  <motion.button
                    onClick={toggleLanguage}
                    className="flex-1 p-3 rounded-lg font-medium"
                    style={{ 
                      backgroundColor: colors.hover,
                      color: colors.text
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === 'en' ? 'SW' : 'EN'}
                  </motion.button>
                </div>

                {isAuthenticated ? (
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: colors.secondary,
                      color: '#FFFFFF'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>{t.logout}</span>
                  </motion.button>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: '#FFFFFF'
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t.login}
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Modal Popup */}
      <AnimatePresence>
        {logoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setLogoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ backgroundColor: colors.bg }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-8">
                  <motion.div
                    className="relative w-full aspect-square rounded-xl overflow-hidden"
                    style={{ border: `4px solid ${colors.primary}` }}
                    animate={{
                      boxShadow: [
                        `0 0 20px ${colors.primary}`,
                        `0 0 40px ${colors.secondary}`,
                        `0 0 20px ${colors.primary}`
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <img 
                      src={logo} 
                      alt="Company Logo" 
                      className="w-full h-full object-contain p-4"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="mt-6 text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
                      {t.company}
                    </h2>
                    <p className="text-lg" style={{ color: colors.textSecondary }}>
                      {t.tagline}
                    </p>
                  </motion.div>
                </div>

                <motion.button
                  onClick={() => setLogoModalOpen(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: colors.secondary,
                    color: '#FFFFFF'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 90
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;